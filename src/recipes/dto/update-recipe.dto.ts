import { PartialType } from '@nestjs/mapped-types';
import { CreateRecipeDto } from './create-recipe.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateRecipeDto extends PartialType(CreateRecipeDto) {
    @IsOptional()
    @IsString()
    name: string;
  
    @IsOptional()
    @IsString()
    ingredients: string[];
  
    @IsOptional()
    @IsString()
    steps: string;
  
    @IsOptional()
    @IsString()
    author: string;
  
    @IsOptional()
    @IsString()
    recommendations: string;
  
    @IsOptional()
    @IsString()
    image: string;
  
    @IsOptional()
    @IsNumber()
    standardUnits: number;
}
