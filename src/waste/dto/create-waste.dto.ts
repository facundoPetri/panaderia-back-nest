import {
  IsString,
  IsMongoId,
  IsDate,
  IsOptional,
  IsDateString,
  IsNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateWasteDto {
  @ApiProperty({
    description: 'Reason for the waste report',
    example: 'Product expired',
    type: String,
  })
  @IsString()
  motive: string;

  @ApiProperty({
    description: 'Array of supply IDs involved in waste',
    example: ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012'],
    type: [String],
    isArray: true,
  })
  @IsMongoId({ each: true })
  supplies: string[];

  @ApiPropertyOptional({
    description: 'ID of the person reporting the waste',
    example: '507f1f77bcf86cd799439013',
    type: String,
  })
  @IsOptional()
  @IsMongoId()
  reporter: string;

  @ApiPropertyOptional({
    description: 'Array of IDs of people responsible for the waste',
    example: ['507f1f77bcf86cd799439014', '507f1f77bcf86cd799439015'],
    type: [String],
    isArray: true,
  })
  @IsOptional()
  @IsMongoId({ each: true })
  responsible: string[];

  @ApiProperty({
    description: 'Date when the waste occurred',
    example: '2024-03-20T12:00:00Z',
    type: Date,
  })
  @IsDateString()
  date: Date;

  @ApiProperty({
    description: 'Quantity of waste',
    example: 10,
    type: Number,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  quantity: number;
}
