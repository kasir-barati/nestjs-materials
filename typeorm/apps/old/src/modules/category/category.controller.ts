import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CreateCategoryResponseDto } from './dto/create-category-response.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { FindOneCategoryResponseDto } from './dto/find-one-category-response.dto';
import { GetCategoriesResponse } from './dto/get-response';
import { UpdateCategoryDto } from './dto/update-category.dto';

// @ApiTags('Categories')
// FIXME: https://github.com/OpenAPITools/openapi-generator/issues/17413
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: 'Create a new category' })
  @ApiCreatedResponse({
    type: CreateCategoryResponseDto,
    description: 'Response contains the id of the created category',
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
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CreateCategoryResponseDto> {
    const category =
      await this.categoryService.create(createCategoryDto);

    return { id: category.id };
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
  @ApiOperation({ summary: 'Fetch category by ID' })
  @ApiOkResponse({
    type: FindOneCategoryResponseDto,
    description: 'Category with the given ID',
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<FindOneCategoryResponseDto> {
    const category = await this.categoryService.findOne(id);

    return {
      id: category.id,
      title: category.title,
    };
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoryService.remove(+id);
  }
}
