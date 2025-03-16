import {
    MiddlewareConsumer,
    Module,
    NestModule,
} from '@nestjs/common';
import { LoggingMiddleware } from './middlewares/logging.middleware';

@Module({})
export class LoggingModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggingMiddleware).forRoutes('*');
    }
}
