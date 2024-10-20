import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Batch } from '../../batch/schemas/batch.schema';
import { Supply } from './supply.schema';

export type RegisterSupplyDocument = HydratedDocument<RegisterSupply>;

@Schema()
export class RegisterSupply {
  @Prop()
  quantity: number;

  @Prop([{ type: 'ObjectId', ref: 'Supply' }])
  supply: Supply;

  @Prop()
  date_used: Date;

  @Prop({ type: 'ObjectId', ref: 'Batch' })
  batch: Batch;
}

export const RegisterSupplySchema =
  SchemaFactory.createForClass(RegisterSupply);
