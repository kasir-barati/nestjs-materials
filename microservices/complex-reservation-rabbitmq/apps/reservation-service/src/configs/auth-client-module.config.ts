import { Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import {
  ClientProvider,
  ClientsModuleOptionsFactory,
  Transport,
} from '@nestjs/microservices';
import reservationServiceConfig from './reservation-service.config';

export class AuthClientsModuleConfig
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
      transport: Transport.RMQ,
      options: {
        urls: [this.authServiceConfigs.RABBITMQ_URI],
        queue: this.authServiceConfigs.AUTH_QUEUE,
      },
    };
  }
}
