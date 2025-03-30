import type { INestApplication } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import type { App } from 'supertest/types';

import { Test } from '@nestjs/testing';
import { RedisContainer } from '@testcontainers/redis';
import request from 'supertest';

import { AppModule } from '../src/app/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const container = await new RedisContainer().start();

    process.env.APP_NAME = 'e2e-test';
    process.env.REDIS_HOST = container.getHostname();
    process.env.REDIS_PORT = container.getPort();
    process.env.PORT = 12301;

    const moduleFixture: TestingModule =
      await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();
  });

  it('/ (GET)', async () => {
    const res = await request(app.getHttpServer()).get('/');

    expect(res.status).toBe(200);
    expect(res.text).toBe('Hello World!');
  }, 10000);
});
