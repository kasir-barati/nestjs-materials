import {
  DRIVER_CREATED_ROUTING_KEY,
  DRIVER_VERIFICATION_REQ_QUEUE,
  Event,
  rabbitmqValidationPipe,
  TOPIC_EXCHANGE,
  VERIFICATION_CREATED_ROUTING_KEY,
  VERIFICATION_DELETED_ROUTING_KEY,
} from '@app/common';
import {
  AmqpConnection,
  RabbitPayload,
  RabbitSubscribe,
} from '@golevelup/nestjs-rabbitmq';
import { Injectable, UsePipes } from '@nestjs/common';
import { Verification } from '../verification/entities/verification.entity';
import { VerificationRepository } from '../verification/repository/verification.repository';

@Injectable()
export class RabbitmqService {
  constructor(
    private readonly verificationRepository: VerificationRepository,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  @UsePipes(rabbitmqValidationPipe)
  @RabbitSubscribe({
    exchange: TOPIC_EXCHANGE,
    queue: DRIVER_VERIFICATION_REQ_QUEUE,
    routingKey: DRIVER_CREATED_ROUTING_KEY,
  })
  async driverVerificationRequest(
    @RabbitPayload() payload: Event<any, any>,
  ): Promise<void> {
    let verification: Verification;

    try {
      verification = await this.verificationRepository.create({
        driverId: payload.afterEvent._id,
      });

      await this.amqpConnection.publish(
        TOPIC_EXCHANGE,
        VERIFICATION_CREATED_ROUTING_KEY,
        {
          beforeEvent: undefined,
          afterEvent: verification,
          eventType: 'create',
          requestId: payload.requestId,
          tags: ['verification'],
          timestamp: new Date().toISOString(),
          userId: payload.userId,
        },
      );
    } catch (error) {
      if (verification) {
        await this.verificationRepository.delete(
          verification._id.toString(),
        );
      }

      await this.amqpConnection.publish(
        TOPIC_EXCHANGE,
        VERIFICATION_DELETED_ROUTING_KEY,
        {
          beforeEvent: verification,
          afterEvent: undefined,
          eventType: 'delete',
          requestId: payload.requestId,
          userId: payload.userId,
          tags: ['verification'],
          timestamp: new Date().toISOString(),
        },
      );

      throw error;
    }
  }
}
