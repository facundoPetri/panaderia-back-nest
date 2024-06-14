import { IsString, IsOptional } from 'class-validator';

export class FindByDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  author: string;

  @IsString()
  @IsOptional()
  ingredients: string;
}
