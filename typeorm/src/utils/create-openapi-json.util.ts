import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as Sinon from 'sinon';
import { AppController } from '../app/app.controller';
import { AppService } from '../app/app.service';
import { CategoryController } from '../modules/category/category.controller';
import { CategoryService } from '../modules/category/category.service';
import { CommentController } from '../modules/comment/comment.controller';
import { CommentService } from '../modules/comment/comment.service';
import { ReviewController } from '../modules/review/review.controller';
import { ReviewService } from '../modules/review/review.service';
import { TalentController } from '../modules/talent/talent.controller';
import { TalentService } from '../modules/talent/talent.service';
import { createSwaggerConfiguration } from './create-swagger.util';
import { writeOpenApi } from './generate-openapi.util';

@Module({
    imports: [],
    controllers: [
        AppController,
        TalentController,
        CategoryController,
        ReviewController,
        CommentController,
    ],
    providers: [
        { provide: AppService, useValue: Sinon.stub(AppService) },
        {
            provide: TalentService,
            useValue: Sinon.stub(TalentService),
        },
        {
            provide: CategoryService,
            useValue: Sinon.stub(CategoryService),
        },
        {
            provide: ReviewService,
            useValue: Sinon.stub(ReviewService),
        },
        {
            provide: CommentService,
            useValue: Sinon.stub(CommentService),
        },
    ],
})
class OpenApiModule {}

async function createOpenApi() {
    const app = await NestFactory.create(OpenApiModule);
    const document = createSwaggerConfiguration({
        app,
        title: 'My Typeorm RESTful API',
        description:
            'It is just another test and has nothing to do with Typeorm API',
        urlWithoutProtocol: 'localhost:3000',
    });

    writeOpenApi(document, process.cwd());
}

createOpenApi()
    .then(console.log.bind(this, 'OpenAPI specification created'))
    .catch(
        console.error.bind(
            this,
            'OpenAPI specification failed to be created',
        ),
    );
