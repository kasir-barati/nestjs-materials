import {
    IsIn,
    IsNotEmpty,
    IsUUID,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class CustomerMessageMeta {
    @IsNotEmpty()
    @IsIn([1])
    schemaVersion: number;
}

export class CustomerBaseMessage {
    @ValidateNested()
    @Type(() => CustomerMessageMeta)
    meta: CustomerMessageMeta;

    @IsNotEmpty()
    @IsUUID(4)
    customerId: string;
}
