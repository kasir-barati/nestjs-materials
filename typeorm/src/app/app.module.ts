import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from '../modules/category/category.module';
import { TalentModule } from '../modules/talent/talent.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'api-db',
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
