import { InputType, PartialType } from '@nestjs/graphql';
import { CreateAlertTypeInput } from './create-alert-type.input';

@InputType()
export class UpdateAlertTypeInput extends PartialType(
  CreateAlertTypeInput,
) {}
