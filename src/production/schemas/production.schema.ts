import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import { Machine } from 'src/machines/schemas/machine.schema';
import { Recipe } from 'src/recipes/schemas/recipe.schema';
import { User } from 'src/users/schemas/user.schema';

export type ProductionDocument = HydratedDocument<Production>;

@Schema()
export class Production extends Document {
  @Prop({ required: true, type: 'ObjectId', ref: 'Recipe' })
  recipe: Recipe;

  @Prop({ required: true, type: 'ObjectId', ref: 'User' })
  user: User;

  @Prop({ unique: true, default: 1 })
  number: number;

  @Prop({ required: false })
  comments: string;

  @Prop()
  total_time: number;

  @Prop({ required: true })
  quantity: number;

  @Prop([{ required: true, type: 'ObjectId', ref: 'Machine' }])
  equipment: Machine[];

  @Prop({ required: true })
  inital_date: Date;

  @Prop({ required: true })
  final_date: Date;
}

export const ProductionSchema = SchemaFactory.createForClass(Production);

ProductionSchema.statics.getNextOrderNumber = async function () {
  const lastProd = await this.findOne().sort('-number');
  return lastProd ? lastProd.number + 1 : 1;
};

ProductionSchema.pre('save', async function (next) {
  if (this.isNew) {
    const doc = this as ProductionDocument;
    doc.number = await (this.constructor as any).getNextOrderNumber();
  }
  next();
});
