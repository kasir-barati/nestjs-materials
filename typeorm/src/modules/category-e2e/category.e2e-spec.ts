import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CategoryModule } from '../category/category.module';
import { CategoryService } from '../category/category.service';

describe('AppController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule =
            await Test.createTestingModule({
                imports: [CategoryModule],
                providers: [CategoryService],
            }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/categories (GET)', () => {
        return request(app.getHttpServer())
            .get('/categories')
            .expect(200)
            .expect('Hello World!');
    });
});
