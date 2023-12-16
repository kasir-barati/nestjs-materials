import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TalentModule } from '../modules/talent/talent.module';
import { CategoryModule } from '../modules/category/category.module';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'typeorm',
            password: 'typeorm',
            database: 'typeorm',
            synchronize: true,
            retryAttempts: 5,
            retryDelay: 5,
            logging: 'all',
            autoLoadEntities: true,
        }),
        TalentModule,
        CategoryModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
