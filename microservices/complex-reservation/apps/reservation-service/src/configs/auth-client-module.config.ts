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
      transport: Transport.TCP,
      options: {
        host: this.authServiceConfigs.AUTH_HOST,
        port: this.authServiceConfigs.AUTH_TCP_PORT,
      },
    };
  }
}
