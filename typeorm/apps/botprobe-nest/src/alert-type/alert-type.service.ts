import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlertType } from './entities/alert-type.entity';

@Injectable()
export class AlertTypeService {
  constructor(
    @InjectRepository(AlertType)
    private alertTypeRepository: Repository<AlertType>,
  ) {}
}
