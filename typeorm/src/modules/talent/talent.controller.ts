import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { CreateTalentResponseDto } from './dto/create-talent-response.dto';
import { CreateTalentDto } from './dto/create-talent.dto';
import { UpdateTalentDto } from './dto/update-talent.dto';
import { TalentService } from './talent.service';

// @ApiTags('Talents')
// FIXME: https://github.com/OpenAPITools/openapi-generator/issues/17413
@Controller('talent')
export class TalentController {
    constructor(private readonly talentService: TalentService) {}

    @Post()
    @ApiCreatedResponse({
        type: CreateTalentResponseDto,
        description: 'Response contains the id of the created talent',
    })
    async create(
        @Body() createTalentDto: CreateTalentDto,
    ): Promise<CreateTalentResponseDto> {
        const talent =
            await this.talentService.create(createTalentDto);

        return { id: talent.id };
    }

    @Get()
    findAll() {
        return this.talentService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.talentService.findOne(+id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateTalentDto: UpdateTalentDto,
    ) {
        return this.talentService.update(+id, updateTalentDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.talentService.remove(+id);
    }
}
