import { Global, Module } from '@nestjs/common';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';

import { correlationIdFormat } from './correlation-id.format';
import { CustomLoggerService } from './custom-logger.service';
import { nestLikeWithDashFormat } from './nest-like-with-dash.format';

@Global()
@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp({ format: 'MM/DD/YYYY, h:mm:ss A' }),
            nestLikeWithDashFormat, // Add " - " before timestamp
            winston.format.ms(),
            correlationIdFormat, // Process correlationId before nestLike
            winston.format.errors({ stack: true }),
            nestWinstonModuleUtilities.format.nestLike('Nest', {
              colors: true,
              prettyPrint: true,
            }),
          ),
        }),
      ],
    }),
  ],
  providers: [CustomLoggerService],
  exports: [CustomLoggerService],
})
export class LoggerModule {}
