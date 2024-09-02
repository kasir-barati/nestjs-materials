import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { RmqContext, RpcException } from '@nestjs/microservices';
import { Channel, Message } from 'amqplib';

@Catch(HttpException)
export class RpcValidationFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToRpc().getContext<RmqContext>();
    const channel: Channel = context.getChannelRef();
    const message = context.getMessage() as Message;
    const status = exception.getStatus();

    if (status === 400) {
      // Do not retry bad incoming message
      // TODO: Can create a new audit log service to publish an event regarding receiving bad data.
      Logger.log({
        message: 'Received bad request data',
        data: JSON.parse(message.content.toString()),
      });
      channel.ack(message);
    } else {
      channel.reject(message, false);
    }

    return new RpcException(exception.getResponse());
  }
}
