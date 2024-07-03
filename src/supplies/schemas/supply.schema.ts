import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Recipe } from '../../recipes/schemas/recipe.schema';

export type SupplyDocument = HydratedDocument<Supply>;

@Schema()
export class Supply {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  type: string;

  @Prop([{ type: 'ObjectId', ref: 'Recipe' }])
  usedIn: Recipe[];

  @Prop()
  min_stock: number;

  @Prop()
  max_stock: number;

  @Prop()
  unit: string;

  @Prop()
  size: string;

  @Prop()
  image: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const SupplySchema = SchemaFactory.createForClass(Supply);
