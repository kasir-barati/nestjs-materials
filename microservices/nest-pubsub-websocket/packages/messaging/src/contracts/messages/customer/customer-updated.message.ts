import { CustomerBaseMessage } from './customer-base.message';
import { Type } from 'class-transformer';
import {
    IsIn,
    IsNotEmpty,
    IsString,
    ValidateNested,
} from 'class-validator';

class CustomerUpdatedMessagePayload {
    @IsNotEmpty()
    @IsIn(['updated'])
    type: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    externalId: string;
}

export class CustomerUpdatedMessage extends CustomerBaseMessage {
    @ValidateNested()
    @Type(() => CustomerUpdatedMessagePayload)
    payload: CustomerUpdatedMessagePayload;
}
