import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Supply } from 'src/supplies/schemas/supply.schema';
import { User } from 'src/users/schemas/user.schema';

export type WasteDocument = HydratedDocument<Waste>;

@Schema()
export class Waste {
  @Prop()
  motive: string;

  @Prop([{ type: 'ObjectId', ref: 'Supply' }])
  supplies: Supply[];

  @Prop({ type: 'ObjectId', ref: 'User' })
  reporter: User;

  @Prop([{ type: 'ObjectId', ref: 'User' }])
  responsible: User[];

  @Prop()
  date: Date;
}

export const WasteSchema = SchemaFactory.createForClass(Waste);