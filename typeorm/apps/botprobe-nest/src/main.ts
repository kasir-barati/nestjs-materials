import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AuthService } from 'shared';
import { AppModule } from './app/app.module';
import appConfig from './app/configs/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { PORT, NODE_ENV } = app.get<ConfigType<typeof appConfig>>(
    appConfig.KEY,
  );

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(PORT);

  if (NODE_ENV !== 'production') {
    const authService = app.get(AuthService);
    const { accessToken } = await authService.getJwtTokens({
      email: 'test@test.com',
      id: 'ed803422-42db-49c1-bc59-c2e9acdc3aa4',
    });

    Logger.log(
      `JWT access token for testing purposes: ${accessToken}`,
    );
  }

  Logger.log(
    `🚀 Application is running on: http://localhost:${PORT}/graphql`,
  );
}

bootstrap();
