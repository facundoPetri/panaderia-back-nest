import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BatchDocument = HydratedDocument<Batch>;

@Schema()
export class Batch {
  @Prop()
  expiration_date: Date;

  @Prop()
  date_of_entry: Date;

  @Prop()
  quantity: number;

  @Prop()
  batch_number: number;

  @Prop()
  row: number;

  @Prop()
  column: number;

  @Prop()
  supply_id: string;
}

export const BatchSchema = SchemaFactory.createForClass(Batch);
