import { getNotificationQueueOptions } from '@app/common';
import { Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import {
  ClientProvider,
  ClientsModuleOptionsFactory,
  Transport,
} from '@nestjs/microservices';
import deadLetterNotificationServiceConfig from './dead-letter-notification-service.config';

export class NotificationClientsModuleConfig
  implements ClientsModuleOptionsFactory
{
  constructor(
    @Inject(deadLetterNotificationServiceConfig.KEY)
    private readonly deadLetterNotificationServiceConfigs: ConfigType<
      typeof deadLetterNotificationServiceConfig
    >,
  ) {}

  createClientOptions(): Promise<ClientProvider> | ClientProvider {
    const {
      RABBITMQ_URI,
      NOTIFICATION_DLQ,
      NOTIFICATION_QUEUE,
      NOTIFICATION_TTL,
    } = this.deadLetterNotificationServiceConfigs;
    const queueOptions = getNotificationQueueOptions({
      dlq: NOTIFICATION_DLQ,
      messageTtl: NOTIFICATION_TTL,
    });

    return {
      transport: Transport.RMQ,
      options: {
        urls: [RABBITMQ_URI],
        queue: NOTIFICATION_QUEUE,
        queueOptions,
      },
    };
  }
}
