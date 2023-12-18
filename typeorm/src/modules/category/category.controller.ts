import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    InternalServerErrorException,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiInternalServerErrorResponse,
    ApiOkResponse,
    ApiOperation,
} from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { GetCategoriesResponse } from './dto/get-response';
import { UpdateCategoryDto } from './dto/update-category.dto';

// @ApiTags('Categories')
// FIXME: https://github.com/OpenAPITools/openapi-generator/issues/17413
@Controller('categories')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @ApiOperation({ summary: 'Create a new category' })
    @ApiOkResponse({
        type: String,
        description: "Return created category's id",
    })
    @ApiBadRequestResponse({
        type: BadRequestException, // FIXME: Create a general error handler and replace this with a better schema
        description: 'Bad request',
    })
    @ApiInternalServerErrorResponse({
        type: InternalServerErrorException,
        description: 'Internal server error',
    })
    @Post()
    create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoryService.create(createCategoryDto);
    }

    @ApiOperation({ summary: 'Fetch categories' })
    @ApiOkResponse({
        type: GetCategoriesResponse, // FIXME: Create a general get all response schema, maybe!?
        description: "Return created category's id",
    })
    @ApiBadRequestResponse({
        type: BadRequestException,
        description: 'Bad request',
    })
    @ApiInternalServerErrorResponse({
        type: InternalServerErrorException,
        description: 'Internal server error',
    })
    @Get()
    findAll() {
        return this.categoryService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.categoryService.findOne(+id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateCategoryDto: UpdateCategoryDto,
    ) {
        return this.categoryService.update(+id, updateCategoryDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.categoryService.remove(+id);
    }
}
