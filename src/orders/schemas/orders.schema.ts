import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ProviderDocument } from 'src/providers/schemas/provider.schema';
import { SupplyDocument } from 'src/supplies/schemas/supply.schema';

export type OrderDocument = HydratedDocument<Order>;

export enum OrderState {
  CREATED = 'Creado',
  PENDING = 'Pendiente',
  COMPLETED = 'Completado',
  CANCELLED = 'Cancelado',
}

@Schema()
export class Order {
  @Prop()
  number: number;

  @Prop()
  received_date: Date;

  @Prop()
  created_at: Date;

  @Prop({ type: 'ObjectId', ref: 'Provider' })
  provider: ProviderDocument;

  @Prop([{ type: 'ObjectId', ref: 'Supply' }])
  supplies: SupplyDocument[];

  @Prop({ enum: OrderState, default: OrderState.CREATED })
  state: OrderState;

  @Prop()
  cancelled_description: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
