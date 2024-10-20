import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Recipe } from 'src/recipes/schemas/recipe.schema';
import { User } from 'src/users/schemas/user.schema';

@Schema()
export class Production extends Document {
    @Prop({ required: true, type: 'ObjectId', ref: 'Recipe' })
    recipe: Recipe;

    @Prop({ required: true, type: 'ObjectId', ref: 'User' })
    user: User;

    @Prop({ required: true })
    number: Date;

    @Prop({ required: false })
    comments: string;

    @Prop({ required: true })
    total_time: number;
    
    @Prop({ required: true })
    quantity: number;

    @Prop({ required: true })
    equipment: string;

    @Prop({ required: true })
    inital_date: Date;

    @Prop({ required: true })
    final_date: Date;
}

export const ProductionSchema = SchemaFactory.createForClass(Production);