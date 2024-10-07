import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class BankingInformation {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  bic: string;

  @Prop({ required: true })
  iban: string;
}
