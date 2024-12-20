import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Supply } from '../../supplies/schemas/supply.schema';

export type ProviderDocument = HydratedDocument<Provider>;

@Schema()
export class Provider {
  @Prop({ unique: true })
  name: string;

  @Prop()
  phone: string;

  @Prop()
  email: string;

  @Prop([{ type: 'ObjectId', ref: 'Supply' }])
  supplies: Supply[];

  @Prop()
  image: string;

  @Prop()
  estimated_delivery_time: number;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const ProviderSchema = SchemaFactory.createForClass(Provider);
