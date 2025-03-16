import {
    IsDateString,
    IsNotEmpty,
    IsNumber,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IotBaseEvent } from './iot-base.event';

class IotGpsEventPayload {
    @IsNotEmpty()
    @IsNumber({ allowInfinity: false, allowNaN: false })
    latitude!: number;

    @IsNotEmpty()
    @IsNumber({ allowInfinity: false, allowNaN: false })
    longitude!: number;

    @IsNotEmpty()
    @IsDateString({ strict: true })
    timestamp!: string;
}

export class IotGpsEvent extends IotBaseEvent {
    @ValidateNested()
    @Type(() => IotGpsEventPayload)
    payload!: IotGpsEventPayload;
}
