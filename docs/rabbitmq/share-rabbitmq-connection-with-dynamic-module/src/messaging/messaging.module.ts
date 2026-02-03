import { RabbitMQModule } from "@golevelup/nestjs-rabbitmq";
import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Global()
@Module({
  imports: [
    RabbitMQModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.getOrThrow('RABBITMQ_URL'),
        exchanges: [{ name: 'amq.topic', type: 'topic' }],
        enableControllerDiscovery: true,
      }),
    }),
  ],
  exports: [RabbitMQModule],
})
export class MessagingModule {}
