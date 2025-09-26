import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoDBContainer } from '@testcontainers/mongodb';
import * as request from 'supertest';
import { App } from 'supertest/types';

import { AppModule } from './../src/app/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const mongodbContainer = await new MongoDBContainer(
      'mongo:8.0.0',
    ).start();

    process.env.DB_URI = mongodbContainer.getConnectionString();
    process.env.NODE_ENV = 'test';

    const moduleFixture: TestingModule =
      await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();
    await app.listen(0);
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it.todo('/users (GET)');
  // , () => {
  //   return request(app.getHttpServer())
  //     .get('/users')
  //     .expect(200)
  //     .expect([]);
  // });
});
