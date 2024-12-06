import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProductionDto {
  @ApiProperty({ description: 'Recipe ID' })
  @IsMongoId()
  @IsNotEmpty()
  recipe: string;

  @ApiProperty({ description: 'User ID' })
  @IsMongoId()
  @IsNotEmpty()
  user: string;

  @ApiProperty({ description: 'Production number' })
  @IsDate()
  @Type(() => Date)
  number: Date;

  @ApiPropertyOptional({ description: 'Optional comments' })
  @IsString()
  @IsOptional()
  comments?: string;

  @ApiProperty({ description: 'Total time in minutes' })
  @IsNumber()
  @IsNotEmpty()
  total_time: number;

  @ApiProperty({ description: 'Quantity produced' })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({
    description: 'Equipment IDs used in production',
    type: [String],
  })
  @IsArray()
  @IsMongoId({ each: true })
  @IsNotEmpty()
  equipment: string[];

  @ApiProperty({ description: 'Initial date of production' })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  inital_date: Date;

  @ApiProperty({ description: 'Final date of production' })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  final_date: Date;
}
