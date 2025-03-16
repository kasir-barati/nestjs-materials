import { Logger as TypeOrmLogger } from 'typeorm';
import { Logger } from './winston-logger.config';

export class PersistenceLogger implements TypeOrmLogger {
    // Decided to not define a type for the different log levels, because we never use this function as a developer.
    log(level: 'log' | 'info' | 'warn', message: any): void {
        Logger.log(level, message);
    }

    logMigration(message: string): void {
        Logger.debug(`Migration: ${message}`);
    }

    logQuery(
        query: string,
        parameters?: Record<string, string>[],
    ): void {
        Logger.debug(`DB Query: ${query}`, parameters);
    }

    logQueryError(error: string | Error): void {
        if (error instanceof Error) {
            Logger.error(error.stack);
            return;
        }

        Logger.error(error);
    }

    logQuerySlow(time: number, query: string): void {
        Logger.warn(`Slow DB Query (duration=${time}ms): ${query}`);
    }

    logSchemaBuild(message: string): void {
        Logger.debug(`DB Schema: ${message}`);
    }
}
