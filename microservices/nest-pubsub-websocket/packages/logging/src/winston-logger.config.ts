import { ClsServiceManager } from 'nestjs-cls';
import * as winston from 'winston';

const logFormatter = winston.format.printf(
    ({ level, message, timestamp, stack }) => {
        const body = stack ? `${message} - ${stack}` : message;
        const cls = ClsServiceManager.getClsService();
        const requestId = cls.getId();

        if (requestId) {
            return `[${level}] [${timestamp}] (RequestId=${requestId}): ${body} `;
        } else {
            return `[${level}] [${timestamp}]: ${body} `;
        }
    },
);

const createConsoleTransport = () => {
    return new winston.transports.Console({
        format: winston.format.combine(
            winston.format.errors({ stack: true }),
            winston.format.colorize({ all: true }),
            winston.format.timestamp(),
            logFormatter,
        ),
    });
};

export const Logger = winston.createLogger({
    level: process.env.LOG_LEVEL?.toLowerCase() || 'debug',
    transports: [createConsoleTransport()],
});
