import { createSwaggerConfiguration } from '@app/common';
import { ValidationPipe } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { AuditLogModule } from './audit-log.module';
import auditLogConfig from './configs/audit-log.config';

async function bootstrap() {
  const app = await NestFactory.create(AuditLogModule);
  const { AUDIT_LOG_API_PORT, SWAGGER_PATH } = app.get<
    ConfigType<typeof auditLogConfig>
  >(auditLogConfig.KEY);
  const appUrl = `http://localhost:${AUDIT_LOG_API_PORT}/`;

  app.use(bodyParser.json({ type: ['json', '+json'] }));
  app.useLogger(app.get(Logger));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      errorHttpStatusCode: 400,
      forbidNonWhitelisted: true,
      validateCustomDecorators: true,
    }),
  );
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  createSwaggerConfiguration({
    app,
    appUrl,
    swaggerPath: SWAGGER_PATH,
    title: 'Driver API microservice.',
    description: 'Driver API microservice RESTful API.',
  });

  await app.listen(AUDIT_LOG_API_PORT);
}
bootstrap();
