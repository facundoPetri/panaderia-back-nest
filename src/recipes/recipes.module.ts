import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { Recipe, RecipeSchema } from './schemas/recipe.schema';
import { PdfService } from 'src/pdf/pdf.service';
import { SuppliesModule } from 'src/supplies/supplies.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Recipe.name, schema: RecipeSchema }]),
    SuppliesModule,
  ],
  controllers: [RecipesController],
  providers: [RecipesService, PdfService],
})
export class RecipesModule {}
