import { getNotificationOptions } from '@app/common';
import { Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import {
  ClientProvider,
  ClientsModuleOptionsFactory,
  Transport,
} from '@nestjs/microservices';
import reservationServiceConfig from './reservation-service.config';

export class NotificationClientsModuleConfig
  implements ClientsModuleOptionsFactory
{
  constructor(
    @Inject(reservationServiceConfig.KEY)
    private readonly authServiceConfigs: ConfigType<
      typeof reservationServiceConfig
    >,
  ) {}

  createClientOptions(): Promise<ClientProvider> | ClientProvider {
    const {
      RABBITMQ_URI,
      NOTIFICATION_TTL,
      NOTIFICATION_QUEUE,
      NOTIFICATION_DLQ,
    } = this.authServiceConfigs;

    return {
      transport: Transport.RMQ,
      options: getNotificationOptions({
        url: RABBITMQ_URI,
        dlq: NOTIFICATION_DLQ,
        queue: NOTIFICATION_QUEUE,
        messageTtl: NOTIFICATION_TTL,
      }),
    };
  }
}
