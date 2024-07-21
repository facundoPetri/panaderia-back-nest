import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Supply } from './supply.schema';

export type BatchDocument = HydratedDocument<Batch>;

@Schema()
export class Batch {
  @Prop({ type: 'ObjectId', ref: 'Supply' })
  supply_id: Supply;

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
}

export const BatchSchema = SchemaFactory.createForClass(Batch);
