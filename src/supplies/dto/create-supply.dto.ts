import {
  IsNotEmpty,
  IsString,
  Length,
  IsNumber,
  IsOptional,
  IsUrl,
  IsMongoId,
} from 'class-validator';

export class CreateSupplyDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  name: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 1000)
  description: string;

  @IsNotEmpty()
  @IsNumber()
  min_stock: number;

  @IsNotEmpty()
  @IsNumber()
  max_stock: number;

  @IsNotEmpty()
  @IsString()
  unit: string;

  @IsNotEmpty()
  @IsNumber()
  size: string;

  @IsOptional()
  @IsString()
  type: string;

  @IsOptional()
  @IsUrl()
  image: string;

  @IsOptional()
  @IsMongoId({ each: true })
  batches: string[];
}
