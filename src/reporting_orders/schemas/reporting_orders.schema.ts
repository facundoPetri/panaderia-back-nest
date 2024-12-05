import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Order } from 'src/orders/schemas/orders.schema';
import { Provider } from 'src/providers/schemas/provider.schema';
import { Supply } from 'src/supplies/schemas/supply.schema';
import { User } from 'src/users/schemas/user.schema';

export type ReportingOrderDocument = HydratedDocument<ReportingOrder>;

@Schema()
export class ReportingOrder {
  @Prop()
  name: string;

  @Prop()
  estimated_date: Date;

  @Prop({ type: 'ObjectId', ref: 'User' })
  author: User;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop([{ type: 'ObjectId', ref: 'Supply' }])
  supplies: Supply[];

  @Prop({ type: 'ObjectId', ref: 'Order' })
  order: Order;

  @Prop({ type: 'ObjectId', ref: 'Provider' })
  provider: Provider;

  @Prop()
  quality_details: string;

  @Prop()
  quality: number;
}

export const ReportingOrderSchema =
  SchemaFactory.createForClass(ReportingOrder);
