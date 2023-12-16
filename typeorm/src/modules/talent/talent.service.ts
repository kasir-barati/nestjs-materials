import { Injectable } from '@nestjs/common';
import { CreateTalentDto } from './dto/create-talent.dto';
import { UpdateTalentDto } from './dto/update-talent.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Talent } from './entities/talent.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TalentService {
    constructor(
        @InjectRepository(Talent)
        private talentRepository: Repository<Talent>,
    ) {}

    create(createTalentDto: CreateTalentDto) {
        return 'This action adds a new talent';
    }

    async findAll() {}

    findOne(id: number) {
        return `This action returns a #${id} talent`;
    }

    update(id: number, updateTalentDto: UpdateTalentDto) {
        return `This action updates a #${id} talent`;
    }

    remove(id: number) {
        return `This action removes a #${id} talent`;
    }
}
