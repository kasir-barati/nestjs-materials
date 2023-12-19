import { DefaultApi } from '../../../api-client';
import { CreateTalentDto } from '../../../modules/talent/dto/create-talent.dto';

export class TalentBuilder {
    private readonly defaultApi: DefaultApi;
    private readonly talent?: CreateTalentDto;

    constructor() {
        this.defaultApi = new DefaultApi();
        this.talent = {
            isActive: false,
            isAdaptable: false,
        };
    }

    withIsActive(isActive: boolean) {
        this.talent.isActive = isActive;
        return this;
    }

    withIsAdaptable(isAdaptable: boolean) {
        this.talent.isAdaptable = isAdaptable;
        return this;
    }

    withCategories(ids: string[]) {
        this.talent.categoriesIds = ids;
        return this;
    }

    async build() {
        // Login as admin/user and then use those info in the next request to perform what you need to do
        const response = await this.defaultApi.talentControllerCreate(
            {
                createTalentDto: this.talent,
            },
        );

        return response.data;
    }
}
