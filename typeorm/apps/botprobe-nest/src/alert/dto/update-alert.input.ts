import { InputType, PartialType } from '@nestjs/graphql';
import { CreateAlertInput } from './create-alert.input';

@InputType()
export class UpdateAlertInput extends PartialType(CreateAlertInput) {}
