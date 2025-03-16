import { IotBaseEvent } from './iot-base.event';
import {
    IsBoolean,
    IsDateString,
    IsNotEmpty,
    IsNumber,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class IotVehicleEventPayload {
    @IsNotEmpty()
    @IsNumber()
    mileage!: number;

    @IsNotEmpty()
    @IsNumber()
    dayTrip!: number;

    @IsNotEmpty()
    @IsNumber()
    speed!: number;

    @IsNotEmpty()
    @IsNumber()
    remainingRange!: number;

    @IsNotEmpty()
    @IsBoolean()
    telematicCriticalError!: boolean;

    @IsNotEmpty()
    @IsDateString({ strict: true })
    timestamp!: string;
}

export class IotVehicleEvent extends IotBaseEvent {
    @ValidateNested()
    @Type(() => IotVehicleEventPayload)
    payload!: IotVehicleEventPayload;
}
