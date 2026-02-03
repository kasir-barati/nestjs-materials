import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConsumer } from './app.consumer';
import { MessagingModule } from './messaging';
import { SomeModule, SomeService } from './some-module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MessagingModule,
    SomeModule.forRootAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          some: configService.getOrThrow('SOME_ENV'),
        };
      },
    }),
  ],
  providers: [AppConsumer],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly someService: SomeService) {}

  async onModuleInit() {
    // Wait a bit for RabbitMQ connection to be established
    setTimeout(async () => {
      console.log('\n🚀 Testing event publishing...\n');
      await this.someService.publishEvent({
        message: 'Hello from SomeService!',
        timestamp: new Date().toISOString(),
        configValue: this.someService.getSomeValue(),
      });
    }, 2000);
  }
}
