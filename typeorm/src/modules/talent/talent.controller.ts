import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import { CreateTalentDto } from './dto/create-talent.dto';
import { UpdateTalentDto } from './dto/update-talent.dto';
import { TalentService } from './talent.service';
// import { ApiTags } from '@nestjs/swagger';

// @ApiTags('Talents')
// FIXME: not able to use these decorators since they cause openapi to not generate api client for it
@Controller('talent')
export class TalentController {
    constructor(private readonly talentService: TalentService) {}

    @Post()
    create(@Body() createTalentDto: CreateTalentDto) {
        return this.talentService.create(createTalentDto);
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
