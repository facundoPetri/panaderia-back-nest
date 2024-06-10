import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const recipe = await this.recipesService.findOne(id);
    if (!recipe) {
      throw new NotFoundException('Receta no encontrada');
    }
    return recipe;
  }

  @Get()
  async findBy(
    @Query()
    query: {
      name?: string;
      author?: string;
      ingredients?: string;
    },
  ) {
    const recipe = await this.recipesService.findBy(query);
    if (!recipe) {
      throw new NotFoundException('Receta no encontrada');
    }
    return recipe;
  }

  @Post()
  create(@Body() createRecipeDto: CreateRecipeDto) {
    return this.recipesService.create(createRecipeDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRecipeDto: UpdateRecipeDto) {
    return this.recipesService.update(id, updateRecipeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recipesService.remove(id);
  }
}
