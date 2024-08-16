import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Reservation extends AbstractDocument {
  @Prop({
    required: true,
  })
  end: Date;

  @Prop({
    required: true,
  })
  start: Date;

  @Prop({
    required: true,
  })
  userId: string;

  @Prop({
    required: true,
  })
  invoiceId: string;

  @Prop({
    required: true,
  })
  locationId: string;

  createdAt: Date;
  updatedAt: Date;
}

export const ReservationSchema =
  SchemaFactory.createForClass(Reservation);
