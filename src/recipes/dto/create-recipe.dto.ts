import {
  IsString,
  IsOptional,
  IsNumber,
  Length,
  IsMongoId,
  IsNotEmpty,
} from 'class-validator';

export class CreateRecipeDto {
  @IsString()
  @Length(3, 50)
  name: string;

  @IsString()
  steps: string;

  @IsString()
  @Length(3, 50)
  author: string;

  @IsOptional()
  @IsString()
  @Length(3, 1000)
  recommendations: string;

  @IsOptional()
  @IsString()
  image: string;

  @IsNumber()
  standardUnits: number;

  @IsNotEmpty()
  @IsMongoId({ each: true })
  supplies: string[];
}
