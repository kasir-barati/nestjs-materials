import { Module } from '@nestjs/common';
import { MessagingModule } from 'messaging';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScalingModule } from './modules/scaling/scaling.module';

@Module({
    imports: [
        MessagingModule.register({
            application: 'app1-api',
            module: 'm1',
        }),
        ScalingModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
