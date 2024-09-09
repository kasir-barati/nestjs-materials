import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Param,
  Patch,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { GetHeader } from '../decorators/get-header.decorator';
import {
  GetResponse,
  ResponseType,
} from '../decorators/get-response.decorator';
import { PatchContentTypeDto } from '../dto/patch-content-type.dto';
import {
  CreatedOrUpdatedProductDto,
  CreateOrUpdateProductDto,
} from './dto/create-product.dto';
import { ProductService } from './product.service';

@ApiTags('Product')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({
    summary: 'Create or update a product resource.',
    description:
      "Create or update a product by id. You need to specify the 'content-type' header to 'application/merge-patch+json'. Note: since all the fields for product are required you cannot possibly send null to remove a field.",
  })
  @ApiOkResponse({
    type: CreatedOrUpdatedProductDto,
    description: 'Returns the updated product resource.',
  })
  @ApiCreatedResponse({
    type: CreatedOrUpdatedProductDto,
    description: 'Returns created product resource.',
  })
  @ApiBadRequestResponse({
    type: BadRequestException,
    description: 'Bad request.',
  })
  @ApiInternalServerErrorResponse({
    type: InternalServerErrorException,
    description: 'Server error.',
  })
  @Patch(':id')
  async createOrUpdate(
    @Param('id') id: string,
    @GetHeader() _: PatchContentTypeDto,
    @Body() createOrUpdateProductDto: CreateOrUpdateProductDto,
    @GetResponse() response: ResponseType,
  ): Promise<CreatedOrUpdatedProductDto> {
    console.log('\n\r\n\r');
    console.log('----------------------Controller 1----------------------');
    console.log('\n\r\n\r');

    const { data, status } = await this.productService.createOrUpdate(
      id,
      createOrUpdateProductDto,
    );
    console.log('\n\r\n\r');
    console.log('----------------------Controller 2----------------------');
    console.log('\n\r\n\r');

    response.setStatus(status === 'created' ? 201 : 200);

    console.log('\n\r\n\r');
    console.log('----------------------Controller 3----------------------');
    console.log('\n\r\n\r');

    return data as CreatedOrUpdatedProductDto;
  }
}
