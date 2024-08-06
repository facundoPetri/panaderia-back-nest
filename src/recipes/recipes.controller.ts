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
  Header,
  Res,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { FindByDto } from './dto/find-by.dto';
import { ParseObjectIdPipe } from '../pipes/parse-object-id-pipe.pipe';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/schemas/user.schema';
import { generatePdf } from 'helpers/handlebars';
import { Response } from 'express';
import { PdfService } from 'src/pdf/pdf.service';

@Controller('recipes')
export class RecipesController {
  constructor(
    private readonly recipesService: RecipesService,
    private readonly pdfService: PdfService,
  ) {}

  @Get('generate-pdf')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename="supplies.pdf"')
  async generatePdf(
    @Res() res: Response,
    @CurrentUser() user: User,
  ): Promise<void> {
    const recipes = await this.recipesService.findAll();

    const html = generatePdf({
      title: 'Listado de Insumos',
      user: user.fullname,
      data: recipes,
      headers: [
        'Autor',
        'Nombre',
        'Ingredientes',
        'Usos',
        'Fecha de creación',
        'Fecha de modificación',
      ],
      tableTemplate: 'recipes',
    });

    const buffer = await this.pdfService.generate(html);

    res.set({
      'Content-Length': buffer.length,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: 0,
    });

    res.end(buffer);
  }

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
    const recipe = await this.recipesService
      .findBy(query)
      .populate(['author', 'supplies']);
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
