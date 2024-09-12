import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import pino from 'pino';
import { PrettyOptions } from 'pino-pretty';
import { genReqId } from './utils/generate-request-id.util';
import { getLevel } from './utils/level.util';
import { serializeRequest } from './utils/request-serializer.util';

const level = getLevel();

@Module({
  imports: [
    PinoLoggerModule.forRoot({
      pinoHttp: {
        genReqId,
        ...(level === 'info'
          ? {
              transport: {
                level,
                target: 'pino-pretty',
                options: {
                  singleLine: true,
                  colorize: true,
                  crlf: true,
                } as PrettyOptions,
              },
            }
          : {}),
        serializers: {
          req: serializeRequest,
        },
        stream: pino.destination({
          dest: './logs',
          minLength: 4096,
          sync: false,
          append: true,
          contentMode: 'utf8',
        }),
      },
    }),
  ],
})
export class LoggerModule {}
