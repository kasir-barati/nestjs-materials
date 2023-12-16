import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Talent } from '../talent/entities/talent.entity';

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

        this.repository
            // FROM "smart-control-api"."AssetMetas" "AssetMeta"
            .createQueryBuilder('AssetMeta')
            // WHERE "AssetMeta"."customerId" = $1
            .where(`"AssetMeta"."customerId" = :customerId`, {
                customerId,
            })
            // LEFT JOIN "smart-control-api"."AssetTodaysGeoTrace" "AssetTodaysGeoTrace" ON "AssetTodaysGeoTrace"."assetMetaId" = "AssetMeta"."id"
            .leftJoinAndSelect(
                'AssetMeta.todaysGeoTrace',
                'todaysGeoTrace',
            )
            // LEFT JOIN "smart-control-api"."AssetGeoTraces" "AssetGeoTraces" ON "AssetGeoTraces"."id" = "AssetTodaysGeoTrace"."traceId"
            .leftJoinAndSelect('todaysGeoTrace.trace', 'trace')
            /*
        LEFT JOIN
          (SELECT *
            FROM "smart-control-api"."AssetGeoTracePoints" "AssetGeoTracePoints"
            ORDER BY "AssetGeoTracePoints"."timestamp" DESC
            LIMIT 10000) "points" ON "points"."assetGeoTraceId" = "trace"."id"
       */
            .leftJoinAndSelect(
                (
                    queryBuilder: SelectQueryBuilder<AssetGeoTracePoint>,
                ) => {
                    return queryBuilder
                        .select('*')
                        .from(
                            AssetGeoTracePoint,
                            'AssetGeoTracePoints',
                        )
                        .orderBy(
                            'AssetGeoTracePoints.timestamp',
                            'DESC',
                        )
                        .limit(10_000);
                },
                'points',
                '"points"."assetGeoTraceId" = "trace"."id"',
            )
            // LEFT JOIN "smart-control-api"."AssetLatestPositions" "AssetLatestPositions" ON "AssetLatestPositions"."assetMetaId" = "AssetMeta"."id"
            .leftJoinAndSelect(
                'AssetMeta.latestPosition',
                'latestPostion',
            )
            // LEFT JOIN "smart-control-api"."FleetMetas" "FleetMetas" ON "FleetMetas"."id" = "AssetMeta"."assignedFleetId"
            .leftJoinAndSelect(
                'AssetMeta.assignedFleet',
                'assignedFleet',
            )
            .groupBy('AssetMeta.id')
            .addGroupBy('todaysGeoTrace.assetMetaId')
            .addGroupBy('todaysGeoTrace.traceId')
            .addGroupBy('trace.id')
            .addGroupBy('latestPostion.assetMetaId')
            .addGroupBy('latestPostion.position')
            .addGroupBy('latestPostion.timestamp')
            .addGroupBy('assignedFleet.id')
            // ORDER BY "AssetMeta"."type" ASC, "AssetMeta"."name" ASC;
            .orderBy('AssetMeta.type', 'ASC')
            .addOrderBy('AssetMeta.name', 'ASC')
            // https://stackoverflow.com/a/67091516/8784518
            .select([
                'AssetMeta.id',
                'AssetMeta.type',
                'AssetMeta.name',
                'AssetMeta.rytleInternalNumber',
                'AssetMeta.customerId',
                'AssetMeta.imei',
                'AssetMeta.assignedFleetId',
                'todaysGeoTrace.assetMetaId',
                'todaysGeoTrace.traceId',
                'trace.id',
                'trace.date',
                'trace.customerId',
                'trace.aborted',
                'trace.createdAt',
                'trace.assetMetaId',
                'JSON_AGG(JSON_BUILD_OBJECT(\'pointId\', "points"."id", \'pointPosition\', "points"."position", \'pointsTimestamp\', "points"."timestamp")) as points',
                'latestPostion.assetMetaId',
                'latestPostion.position',
                'latestPostion.timestamp',
                'assignedFleet.id',
                'assignedFleet.name',
                'assignedFleet.customerId',
                'assignedFleet.createdAt',
                'assignedFleet.updatedAt',
            ])
            .getRawMany();
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
