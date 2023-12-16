import { Module } from '@nestjs/common';
import Sinon from 'sinon';
import { AppController } from '../app/app.controller';
import { TalentController } from '../modules/talent/talent.controller';
import { CategoryController } from '../modules/category/category.controller';
import { AppService } from '../app/app.service';
import { TalentService } from '../modules/talent/talent.service';
import { CategoryService } from '../modules/category/category.service';
import { NestFactory } from '@nestjs/core';

@Module({
    imports: [],
    controllers: [
        AppController,
        TalentController,
        CategoryController,
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
    ],
})
class OpenApiModule {}

async function createOpenApi() {
    const app = await NestFactory.create(OpenApiModule);
    const document = 
}
