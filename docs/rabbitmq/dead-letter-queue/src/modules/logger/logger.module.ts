import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';

import { LogMode } from '../../app.type';
import { correlationIdFormat } from './correlation-id.format';
import { CustomLoggerService } from './custom-logger.service';
import { jsonFormat } from './json-format';
import { nestLikeWithDashFormat } from './nest-like-with-dash.format';

@Global()
@Module({
  imports: [
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const logMode = configService.get<LogMode>('appConfigs.LOG_MODE');
        const isJsonMode = logMode === 'JSON';

        return {
          transports: [
            new winston.transports.Console({
              format: isJsonMode
                ? jsonFormat
                : winston.format.combine(
                    winston.format.timestamp(),
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
        };
      },
    }),
  ],
  providers: [CustomLoggerService],
  exports: [CustomLoggerService],
})
export class LoggerModule {}
