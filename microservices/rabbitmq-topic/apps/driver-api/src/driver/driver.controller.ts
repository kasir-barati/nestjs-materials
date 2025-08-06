import {
  GetHeader,
  MongoIdPipe,
  PatchContentTypeDto,
} from '@app/common';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Req,
  Res,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { DriverSanitizer } from './driver.sanitizer';
import { DriverService } from './driver.service';
import { CreateOrUpdateDriverDto } from './dto/create-or-update-driver.dto';
import {
  CreatedOrUpdatedDriverDto,
  FindByIdDriverDto,
} from './dto/response.dto';

@ApiTags('Driver')
@Controller('drivers')
export class DriverController {
  constructor(
    private readonly driverService: DriverService,
    private readonly driverSanitizer: DriverSanitizer,
  ) {}

  @ApiConsumes('application/merge-patch+json')
  @ApiOperation({
    summary: 'Create or update a driver resource.',
    description:
      "Create or update a driver by id. You need to specify the 'content-type' header to 'application/merge-patch+json'. Note: since all the fields for driver are required you cannot possibly send null to remove a field.",
  })
  @ApiParam({
    name: 'id',
    description: "Driver's ID",
    example: '66e2c2e4cf97c6df4a62b432',
  })
  @ApiOkResponse({
    type: CreatedOrUpdatedDriverDto,
    description: 'Returns the updated driver resource.',
  })
  @ApiCreatedResponse({
    type: CreatedOrUpdatedDriverDto,
    description: 'Returns created driver resource.',
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
    @Param('id', MongoIdPipe) id: string,
    @Body() createOrUpdateDriverDto: CreateOrUpdateDriverDto,
    @GetHeader() _: PatchContentTypeDto,
    @Res() response: Response,
    @Req() request: Request,
  ) {
    const { data, status } = await this.driverService.createOrUpdate({
      id,
      createOrUpdateDriverDto,
      requestId: request.id.toString(),
    });
    const sanitizedData =
      this.driverSanitizer.toCreatedOrUpdatedDriver(data);

    response
      .status(status === 'created' ? 201 : 200)
      .send(sanitizedData);
  }

  @ApiOperation({
    summary: 'Read one driver.',
    description: 'Read one driver.',
  })
  @ApiOkResponse({
    type: FindByIdDriverDto,
    description: 'Returns a driver resource.',
  })
  @ApiInternalServerErrorResponse({
    type: InternalServerErrorException,
    description: 'Server error.',
  })
  @ApiParam({
    name: 'id',
    description: "Driver's ID",
    example: '66e2c2ffab0befcdd01d7d87',
  })
  @Get(':id')
  async findById(
    @Param('id', MongoIdPipe) id: string,
  ): Promise<FindByIdDriverDto> {
    const unsanitizedData = await this.driverService.findById(id);

    return this.driverSanitizer.toFindByIdDriver(unsanitizedData);
  }
}
