import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Comment } from '../comment/entities/comment.entity';
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
        /**
         query: SELECT "talent"."id" AS "talent_id", "talent"."is_active" AS "talent_is_active", "talent"."is_adaptable" AS "talent_is_adaptable", "categories"."id" AS "categories_id", "categories"."title" AS "categories_title", "reviews"."id" AS "reviews_id", "reviews"."text" AS "reviews_text", "reviews"."rating" AS "reviews_rating", "reviews"."talent_id" AS "reviews_talent_id", "comments".* FROM "talents" "talent" LEFT JOIN "talents_of_categories" "talent_categories" ON "talent_categories"."category_id"="talent"."id" LEFT JOIN "categories" "categories" ON "categories"."id"="talent_categories"."talent_id"  LEFT JOIN "review" "reviews" ON "reviews"."talent_id"="talent"."id"  LEFT JOIN (SELECT * FROM (SELECT * FROM "comments" "comments" ORDER BY createAt DESC LIMIT 3) "comments" ORDER BY DESC ASC) "comments" ON "reviews"."id" = "comments"."review_id"
2023-12-18 20:15:26 query failed: SELECT "talent"."id" AS "talent_id", "talent"."is_active" AS "talent_is_active", "talent"."is_adaptable" AS "talent_is_adaptable", "categories"."id" AS "categories_id", "categories"."title" AS "categories_title", "reviews"."id" AS "reviews_id", "reviews"."text" AS "reviews_text", "reviews"."rating" AS "reviews_rating", "reviews"."talent_id" AS "reviews_talent_id", "comments".* FROM "talents" "talent" LEFT JOIN "talents_of_categories" "talent_categories" ON "talent_categories"."category_id"="talent"."id" LEFT JOIN "categories" "categories" ON "categories"."id"="talent_categories"."talent_id"  LEFT JOIN "review" "reviews" ON "reviews"."talent_id"="talent"."id"  LEFT JOIN (SELECT * FROM (SELECT * FROM "comments" "comments" ORDER BY createAt DESC LIMIT 3) "comments" ORDER BY DESC ASC) "comments" ON "reviews"."id" = "comments"."review_id"
2023-12-18 20:15:26 error: error: syntax error at or near "DESC"
         */
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
