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

  @IsOptional()
  @IsString()
  steps: string;

  @IsOptional()
  @IsString()
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
