import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Supply } from '../../supplies/schemas/supply.schema';

export type RecipeDocument = HydratedDocument<Recipe>;

@Schema()
export class Recipe {
  @Prop()
  name: string;

  @Prop([{ type: 'ObjectId', ref: 'Supply' }])
  supplies: Supply[];

  @Prop()
  steps: string;

  @Prop()
  author: string;

  @Prop()
  recommendations: string;

  @Prop({ default: true })
  state: boolean;

  @Prop()
  uses: number;

  @Prop()
  image: string;

  @Prop()
  standardUnits: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);
