import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import pino from 'pino';
import { PrettyOptions } from 'pino-pretty';
import { genReqId } from './utils/generate-request-id.util';
import { getLevel } from './utils/level.util';
import { serializeRequest } from './utils/request-serializer.util';
import { serializeResponse } from './utils/response-serializer.util';

const level = getLevel();

@Module({
  imports: [
    PinoLoggerModule.forRoot({
      pinoHttp: {
        genReqId,
        ...(level === 'debug'
          ? {
              transport: {
                level,
                target: 'pino-pretty',
                options: {
                  // singleLine: true,
                  colorize: true,
                  crlf: true,
                } as PrettyOptions,
              },
            }
          : {}),
        serializers: {
          req: serializeRequest,
          res: serializeResponse,
        },
        ...(level === 'info'
          ? {
              stream: pino.destination({
                dest: './logs',
                minLength: 4096,
                sync: false,
                append: true,
                contentMode: 'utf8',
              }),
            }
          : {}),
      },
    }),
  ],
})
export class LoggerModule {}
