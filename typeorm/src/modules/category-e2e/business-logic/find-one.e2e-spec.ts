import { CategoryBuilder } from '../../../utils/test/builders/category.builder';
import { DefaultApi } from './../../../api-client/api';
describe('Category e2e (/:id GET): business logic', () => {
    const defaultApi = new DefaultApi();

    it.each([
        `Category-${Math.random()}`,
        `Category-${Math.random()}`,
    ])(
        'should be able to fetch the category info from the endpoint',
        async (title: string) => {
            const category = await new CategoryBuilder()
                .withTitle(title)
                .build();

            const response =
                await defaultApi.categoryControllerFindOne({
                    id: category.id,
                });

            expect(response.data.id).toStrictEqual(category.id);
            expect(response.data.title).toStrictEqual(title);
        },
    );
});
