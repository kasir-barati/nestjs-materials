import { CustomerBaseMessage } from './customer-base.message';
import { Type } from 'class-transformer';
import {
    IsIn,
    IsNotEmpty,
    IsString,
    ValidateNested,
} from 'class-validator';

class CustomerCreatedMessagePayload {
    @IsNotEmpty()
    @IsIn(['created'])
    type: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    externalId: string;
}

export class CustomerCreatedMessage extends CustomerBaseMessage {
    @ValidateNested()
    @Type(() => CustomerCreatedMessagePayload)
    payload: CustomerCreatedMessagePayload;
}
