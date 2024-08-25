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
    return {
      transport: Transport.RMQ,
      options: {
        urls: [
          this.deadLetterNotificationServiceConfigs.RABBITMQ_URI,
        ],
        queue:
          this.deadLetterNotificationServiceConfigs
            .NOTIFICATION_QUEUE,
      },
    };
  }
}
