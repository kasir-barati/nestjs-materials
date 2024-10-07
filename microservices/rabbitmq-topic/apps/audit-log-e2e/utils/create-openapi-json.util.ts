import { createSwaggerConfiguration } from '@app/common';
import { writeOpenApi } from '@app/testing';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import * as Sinon from 'sinon';
import { AuditLogController } from '../../audit-log/src/audit-log.controller';
import auditLogApiConfig from '../../audit-log/src/configs/audit-log.config';
import { AuditLogSerializer } from '../../audit-log/src/services/audit-log-serializer.service';
import { AuditLogService } from '../../audit-log/src/services/audit-log.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        join(process.cwd(), '.env'),
        join(process.cwd(), 'apps', 'audit-log', '.env'),
      ],
      load: [auditLogApiConfig],
      isGlobal: true,
      cache: true,
    }),
  ],
  controllers: [AuditLogController],
  providers: [
    {
      provide: AuditLogService,
      useValue: Sinon.stub(AuditLogService),
    },
    {
      provide: AuditLogSerializer,
      useValue: Sinon.stub(AuditLogSerializer),
    },
  ],
})
class OpenApiModule {}

async function createOpenApi() {
  const app = await NestFactory.create(OpenApiModule);
  const { SWAGGER_PATH, AUDIT_LOG_API_PORT } = app.get<
    ConfigType<typeof auditLogApiConfig>
  >(auditLogApiConfig.KEY);
  const document = createSwaggerConfiguration({
    app,
    swaggerPath: SWAGGER_PATH,
    title: 'The auth RESTful API.',
    appUrl: `http://localhost:${AUDIT_LOG_API_PORT}`,
    description: 'The auth RESTful API.',
  });
  const openApiOutputDirectory = join(
    process.cwd(),
    'apps',
    'audit-log',
  );
  const openApiFilePath = writeOpenApi(
    document,
    openApiOutputDirectory,
  );

  Logger.log(
    `OpenAPI specification created: ${openApiFilePath}`,
    'OpenApiModule',
  );
}

createOpenApi()
  .then(() => {
    Logger.log('OpenAPI specification created', 'OpenApiModule');
    process.exit(0);
  })
  .catch(() => {
    Logger.error(
      'OpenAPI specification failed to be created',
      'OpenApiModule',
    );
  });
