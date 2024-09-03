import { getNotificationOptions } from '@app/common';
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
    const options = getNotificationOptions({
      url: RABBITMQ_URI,
      dlq: NOTIFICATION_DLQ,
      queue: NOTIFICATION_QUEUE,
      messageTtl: NOTIFICATION_TTL,
    });

    return {
      transport: Transport.RMQ,
      options,
    };
  }
}
