import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Supply } from 'src/supplies/schemas/supply.schema';
import { User } from 'src/users/schemas/user.schema';

export type WasteDocument = HydratedDocument<Waste>;

// Interface for supply quantity
interface SupplyQuantity {
  supplyId: Supply;
  quantity: number;
}

@Schema()
export class Waste {
  @Prop()
  motive: string;

  @Prop([
    {
      supplyId: { type: 'ObjectId', ref: 'Supply' },
      quantity: { type: Number, required: true },
    },
  ])
  supplies: SupplyQuantity[];

  @Prop({ type: 'ObjectId', ref: 'User' })
  reporter: User;

  @Prop({ type: 'ObjectId', ref: 'User' })
  responsible: User;

  @Prop()
  date: Date;
}

export const WasteSchema = SchemaFactory.createForClass(Waste);
