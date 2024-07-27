import {
  IsNotEmpty,
  IsString,
  Length,
  IsNumber,
  Max,
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

  @IsOptional()
  @IsString()
  usedIn: string[];

  @IsNotEmpty()
  @IsNumber()
  @Max(1000)
  min_stock: number;

  @IsNotEmpty()
  @IsNumber()
  @Max(1000)
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
