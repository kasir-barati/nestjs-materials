import { Module } from '@nestjs/common';
import { TalentService } from './talent.service';
import { TalentController } from './talent.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Talent } from './entities/talent.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Talent])],
  controllers: [TalentController],
  providers: [TalentService],
})
export class TalentModule {}
