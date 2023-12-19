import { DefaultApi } from '../../../api-client';
import { CreateCategoryDto } from '../../../modules/category/dto/create-category.dto';

export class CategoryBuilder {
    private readonly defaultApi: DefaultApi;
    private readonly category: CreateCategoryDto;

    constructor() {
        this.defaultApi = new DefaultApi();
        this.category = { title: 'resourceful' };
    }

    withTitle(title: string) {
        this.category.title = title;
        return this;
    }

    async build() {
        const response =
            await this.defaultApi.categoryControllerCreate({
                createCategoryDto: this.category,
            });

        return response.data;
    }
}
