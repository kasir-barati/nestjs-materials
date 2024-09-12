import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  Param,
  Patch,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { AppService } from './app.service';
import { BodyDto } from './dto/body.dto';
import { QueryStringDto } from './dto/query-string.dto';

@ApiTags('App')
@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @ApiOperation({
    description: 'Just receive a request and return its query string',
  })
  @ApiOkResponse({
    type: QueryStringDto,
    description: 'Returns query strings.',
  })
  @ApiBadRequestResponse({
    type: BadRequestException,
    description: 'Bad request',
  })
  @ApiInternalServerErrorResponse({
    type: InternalServerErrorException,
    description: 'Server error.',
  })
  @Get()
  getHello(@Query() queryStrings: QueryStringDto) {
    return this.appService.getHello(queryStrings);
  }

  @ApiOperation({
    description: 'Just receive a request and return its body',
  })
  @ApiOkResponse({
    type: BodyDto,
    description: 'Returns passed body + id in the query param.',
  })
  @ApiBadRequestResponse({
    type: BadRequestException,
    description: 'Bad request',
  })
  @ApiInternalServerErrorResponse({
    type: InternalServerErrorException,
    description: 'Server error.',
  })
  @Patch(':id')
  PatchHello(
    @Param('id') id: string,
    @Body() body: BodyDto,
    @Req() req: Request,
  ) {
    this.logger.log(`ID inside the path: ${id}`);
    // Serializer defined in the logger.module.ts won't change this req object!
    // console.dir(req, { depth: null });

    return this.appService.patchHello(body);
  }
}
