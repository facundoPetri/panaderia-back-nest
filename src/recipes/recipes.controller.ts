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
import { FindByDto } from './dto/find-by.dto';
import { ParseObjectIdPipe } from '../pipes/parse-object-id-pipe.pipe';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Get(':id')
  async findOne(@Param('id', ParseObjectIdPipe) id: string) {
    const recipe = await this.recipesService.findOne(id);
    if (!recipe) {
      throw new NotFoundException('Receta no encontrada');
    }
    return recipe;
  }

  @Get()
  async findBy(
    @Query()
    query: FindByDto,
  ) {
    const recipe = await this.recipesService.findBy(query).populate(['author', 'supplies']);
    if (!recipe) {
      throw new NotFoundException('Receta no encontrada');
    }
    return recipe;
  }

  @Post()
  create(@Body() createRecipeDto: CreateRecipeDto, @CurrentUser() user: any) {
    return this.recipesService.create(createRecipeDto, user);
  }

  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateRecipeDto: UpdateRecipeDto,
  ) {
    return this.recipesService.update(id, updateRecipeDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.recipesService.remove(id);
  }
}
