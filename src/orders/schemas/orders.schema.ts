import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ProviderDocument } from 'src/providers/schemas/provider.schema';
import { Supply } from 'src/supplies/schemas/supply.schema';

export type OrderDocument = HydratedDocument<Order>;

interface SupplyQuantity {
  supplyId: Supply;
  quantity: number;
}

export enum OrderState {
  CREATED = 'Creado',
  PENDING = 'Pendiente',
  COMPLETED = 'Completado',
  CANCELLED = 'Cancelado',
}

@Schema()
export class Order {
  @Prop({ unique: true })
  number: number;

  @Prop()
  received_date: Date;

  @Prop()
  created_at: Date;

  @Prop([
    {
      supplyId: { type: 'ObjectId', ref: 'Supply' },
      quantity: { type: Number, required: true },
    },
  ])
  supplies: SupplyQuantity[];

  @Prop({ type: 'ObjectId', ref: 'Provider' })
  provider: ProviderDocument;

  @Prop({ enum: OrderState, default: OrderState.CREATED })
  state: OrderState;

  @Prop()
  cancelled_description: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.statics.getNextOrderNumber = async function () {
  const lastOrder = await this.findOne().sort('-number');
  return lastOrder ? lastOrder.number + 1 : 1;
};

OrderSchema.pre('save', async function (next) {
  if (this.isNew) {
    const doc = this as OrderDocument;
    doc.number = await (this.constructor as any).getNextOrderNumber();
  }
  next();
});
