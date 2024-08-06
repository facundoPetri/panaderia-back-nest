import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Supply } from '../../supplies/schemas/supply.schema';
import { User } from 'src/users/schemas/user.schema';

export type RecipeDocument = HydratedDocument<Recipe>;

@Schema()
export class Recipe {
  @Prop()
  name: string;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Supply' }])
  supplies: Supply[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  author: User;

  @Prop()
  steps: string;

  @Prop()
  recommendations: string;

  @Prop({ default: true })
  state: boolean;

  @Prop({ default: 0 })
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
