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
    return {
      transport: Transport.TCP,
      options: {
        host: this.authServiceConfigs.NOTIFICATION_HOST,
        port: this.authServiceConfigs.NOTIFICATION_TCP_PORT,
      },
    };
  }
}
