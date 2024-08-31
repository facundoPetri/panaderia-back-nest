import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Supply } from '../../supplies/schemas/supply.schema';

export type SuppliesUsageDocument = HydratedDocument<SuppliesUsage>;

@Schema()
export class SuppliesUsage {
  @Prop()
  quantity: number;

  @Prop({ type: 'ObjectId', ref: 'Supply' })
  supply: Supply;

  @Prop()
  date_used: Date;
}

export const SuppliesUsageSchema = SchemaFactory.createForClass(SuppliesUsage);
