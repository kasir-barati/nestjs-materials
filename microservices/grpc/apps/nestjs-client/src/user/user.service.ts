import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import {
  CurrentUser,
  SEND_EMAIL_NOTIFICATION,
  SendEmailNotification,
  TOPIC_EXCHANGE,
} from '@grpc/shared';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  async postProcessedOrderActions(orderId: string, user: CurrentUser) {
    const message: SendEmailNotification = {
      content: 'Order was processed',
      recipientEmailAddress: user.email,
    };

    // Publishes message to the routing key. No need to specify queue.
    await this.amqpConnection.publish(
      TOPIC_EXCHANGE,
      SEND_EMAIL_NOTIFICATION,
      message
    );
  }
}
