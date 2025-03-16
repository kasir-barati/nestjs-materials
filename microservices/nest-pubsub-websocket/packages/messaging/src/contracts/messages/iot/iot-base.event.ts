import {
    IsIn,
    IsNotEmpty,
    IsString,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class IotEventMeta {
    @IsNotEmpty()
    @IsIn([1])
    schemaVersion!: number;
}

export class IotBaseEvent {
    @ValidateNested()
    @Type(() => IotEventMeta)
    meta!: IotEventMeta;

    @IsNotEmpty()
    @IsString()
    imei!: string;
}
