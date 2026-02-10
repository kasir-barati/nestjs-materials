import type { Logger as WinstonLogger } from 'winston';

import { Inject, Injectable, LoggerService, Scope } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable({ scope: Scope.TRANSIENT })
export class CustomLoggerService implements LoggerService {
  private context?: string;

  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly winstonLogger: WinstonLogger,
  ) {}

  setContext(context: string) {
    this.context = context;
  }

  log(message: any, contextOrMeta?: string | Record<string, any>) {
    if (typeof contextOrMeta === 'string') {
      this.winstonLogger.log({
        level: 'info',
        message,
        context: contextOrMeta,
      });
    } else if (contextOrMeta && typeof contextOrMeta === 'object') {
      const { context, ...meta } = contextOrMeta as any;
      this.winstonLogger.log({
        level: 'info',
        message,
        context: context || this.context,
        ...meta,
      });
    } else {
      this.winstonLogger.log({
        level: 'info',
        message,
        context: this.context,
      });
    }
  }

  error(
    message: any,
    traceOrMeta?: string | Record<string, any>,
    contextOrUndefined?: string,
  ) {
    if (typeof traceOrMeta === 'string') {
      this.winstonLogger.log({
        level: 'error',
        message,
        context: contextOrUndefined || this.context,
        stack: traceOrMeta,
      });
    } else if (traceOrMeta && typeof traceOrMeta === 'object') {
      const { context, ...meta } = traceOrMeta as any;
      this.winstonLogger.log({
        level: 'error',
        message,
        context: context || this.context,
        ...meta,
      });
    } else {
      this.winstonLogger.log({
        level: 'error',
        message,
        context: this.context,
      });
    }
  }

  warn(message: any, contextOrMeta?: string | Record<string, any>) {
    if (typeof contextOrMeta === 'string') {
      this.winstonLogger.log({
        level: 'warn',
        message,
        context: contextOrMeta,
      });
    } else if (contextOrMeta && typeof contextOrMeta === 'object') {
      const { context, ...meta } = contextOrMeta as any;
      this.winstonLogger.log({
        level: 'warn',
        message,
        context: context || this.context,
        ...meta,
      });
    } else {
      this.winstonLogger.log({
        level: 'warn',
        message,
        context: this.context,
      });
    }
  }

  debug(message: any, contextOrMeta?: string | Record<string, any>) {
    if (typeof contextOrMeta === 'string') {
      this.winstonLogger.log({
        level: 'debug',
        message,
        context: contextOrMeta,
      });
    } else if (contextOrMeta && typeof contextOrMeta === 'object') {
      const { context, ...meta } = contextOrMeta as any;
      this.winstonLogger.log({
        level: 'debug',
        message,
        context: context || this.context,
        ...meta,
      });
    } else {
      this.winstonLogger.log({
        level: 'debug',
        message,
        context: this.context,
      });
    }
  }

  verbose(message: any, contextOrMeta?: string | Record<string, any>) {
    if (typeof contextOrMeta === 'string') {
      this.winstonLogger.log({
        level: 'verbose',
        message,
        context: contextOrMeta,
      });
    } else if (contextOrMeta && typeof contextOrMeta === 'object') {
      const { context, ...meta } = contextOrMeta as any;
      this.winstonLogger.log({
        level: 'verbose',
        message,
        context: context || this.context,
        ...meta,
      });
    } else {
      this.winstonLogger.log({
        level: 'verbose',
        message,
        context: this.context,
      });
    }
  }
}
