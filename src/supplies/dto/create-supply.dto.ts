import {
  IsNotEmpty,
  IsString,
  Length,
  IsNumber,
  Max,
  IsOptional,
  IsUrl,
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
  @IsString()
  @Length(3, 50)
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
  @Length(3, 50)
  unit: string;

  @IsNotEmpty()
  @IsNumber()
  size: string;

  @IsOptional()
  @IsUrl()
  image: string;
}
