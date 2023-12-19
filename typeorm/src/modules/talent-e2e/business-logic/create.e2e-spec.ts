import { isUUID } from 'class-validator';
import { DefaultApi } from '../../../api-client';
import { CategoryBuilder } from '../../../utils/test/builders/category.builder';
import { CreateTalentDto } from '../../talent/dto/create-talent.dto';

describe('Talent e2e (/ POST)', () => {
    const defaultApi = new DefaultApi();

    it.each<CreateTalentDto>([
        { isActive: false, isAdaptable: true },
        { isActive: true, isAdaptable: false },
    ])(
        'should be able to create a new talent with no category and return its id',
        async (talent) => {
            const response = await defaultApi.talentControllerCreate({
                createTalentDto: talent,
            });

            expect(response.data.id).toBeDefined();
            expect(isUUID(response.data.id, '4')).toBeTruthy();
        },
    );

    it.each([3, 5])(
        'should be able to create a new talent with %s categories and return its id',
        async (countOfCategories: number) => {
            const categoriesIds: string[] = [];
            while (countOfCategories--) {
                const category = await new CategoryBuilder()
                    .withTitle(Date.now().toString())
                    .build();
                categoriesIds.push(category.id);
            }

            const response = await defaultApi.talentControllerCreate({
                createTalentDto: {
                    isActive: true,
                    isAdaptable: true,
                    categoriesIds: categoriesIds,
                },
            });

            expect(response.data.id).toBeDefined();
            expect(isUUID(response.data.id, '4')).toBeTruthy();
        },
    );
});
