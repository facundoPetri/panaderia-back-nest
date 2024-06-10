import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Recipe } from './schemas/recipe.schema';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class RecipesService {
  constructor(@InjectModel(Recipe.name) private recipeModel: Model<Recipe>) {}

  create(createRecipeDto: CreateRecipeDto) {
    const recipe = new this.recipeModel(createRecipeDto);
    return recipe.save();
  }

  findAll() {
    return this.recipeModel.find();
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id) || !id) {
      return null;
    }
    return this.recipeModel.findOne({ _id: id });
  }

  findBy(query: { name?: string; author?: string; ingredients?: string }) {
    return this.recipeModel.find(query);
  }

  async update(id: string, updateRecipeDto: UpdateRecipeDto) {
    const recipe = await this.findOne(id);
    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }
    Object.assign(recipe, updateRecipeDto);
    return recipe.save();
  }

  async remove(id: string) {
    const recipe = await this.findOne(id);
    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }
    return this.recipeModel.deleteOne({ _id: id });
  }
}
