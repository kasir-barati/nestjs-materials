import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Talent } from '../talent/entities/talent.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
    ) {}

    create(createCategoryDto: CreateCategoryDto) {
        return 'This action adds a new category';
    }

    async findAll(categoryId?: string) {
        // the order in which you chain methods does matter. The methods are typically chained in the order they should be executed in the resulting SQL query. Each method usually adds a specific part to the query, and the order of method calls determines the overall structure of the query.
        const query = this.categoryRepository
            .createQueryBuilder('findAllWithLimitedLeftJoinedTalents')
            .leftJoinAndSelect(
                (subQuery: SelectQueryBuilder<Talent>) => {
                    return subQuery
                        .select()
                        .from(Talent, 'talents')
                        .limit(10000);
                },
                'talents',
            )
            .leftJoinAndSelect(
                'talent.workingCategories',
                'talentCategories',
            )
            .where(
                'talent.isActive = :isActive AND talent.isAdaptable = :isAdaptable',
                { isActive: true, isAdaptable: false },
            );

        if (categoryId) {
            query.andWhere('category.id = :categoryId', {
                categoryId,
            });
        }

        query
            .select([
                'category.id',
                'category.title',
                'talent.id',
                'talent.name',
                'talentCategories.id',
                'talentCategories.title',
            ])
            .orderBy('category.created_at', 'ASC')
            .addOrderBy('talent.created_at', 'ASC');
        return await query.getMany();
    }

    findOne(id: number) {
        return `This action returns a #${id} category`;
    }

    update(id: number, updateCategoryDto: UpdateCategoryDto) {
        return `This action updates a #${id} category`;
    }

    remove(id: number) {
        return `This action removes a #${id} category`;
    }
}
