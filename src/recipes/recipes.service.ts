import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Recipe } from './schemas/recipe.schema';
import { Model } from 'mongoose';
import { FindByDto } from './dto/find-by.dto';

@Injectable()
export class RecipesService {
  constructor(@InjectModel(Recipe.name) private recipeModel: Model<Recipe>) {}

  create(createRecipeDto: CreateRecipeDto, user: any) {
    const recipe = new this.recipeModel(createRecipeDto);
    recipe.author = user._id;
    return recipe.save();
  }

  findAll() {
    return this.recipeModel.find().populate(['supplies', 'author']).exec();
  }

  findOne(id: string) {
    if (!id) {
      return null;
    }
    return this.recipeModel.findOne({ _id: id }).populate(['supplies', 'author']).exec();
  }

  findBy(query: FindByDto) {
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
