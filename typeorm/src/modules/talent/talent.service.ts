import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateTalentDto } from './dto/create-talent.dto';
import { UpdateTalentDto } from './dto/update-talent.dto';
import { Talent } from './entities/talent.entity';

@Injectable()
export class TalentService {
    constructor(
        @InjectRepository(Talent)
        private talentRepository: Repository<Talent>,
    ) {}

    create(createTalentDto: CreateTalentDto) {
        return 'This action adds a new talent';
    }

    async findAll() {
        return (
            this.talentRepository
                .createQueryBuilder('talent')
                .leftJoinAndSelect('talent.categories', 'categories')
                .leftJoinAndSelect('talent.reviews', 'reviews')
                .leftJoinAndSelect(
                    (queryBuilder: SelectQueryBuilder<Comment>) => {
                        return queryBuilder
                            .select('*')
                            .from(
                                (
                                    subQueryBuilder: SelectQueryBuilder<Comment>,
                                ) => {
                                    return subQueryBuilder
                                        .select('*')
                                        .from(Comment, 'comments')
                                        .orderBy('createAt', 'DESC')
                                        .limit(3);
                                },
                                'comments',
                            )
                            .orderBy('DESC');
                    },
                    'comments',
                    '"reviews"."id" = "comments"."review_id"',
                )
                // .groupBy()
                // .addGroupBy()
                // .select([])
                .getRawMany()
        );
    }

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
