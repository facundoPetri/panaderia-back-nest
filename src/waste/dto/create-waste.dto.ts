// create-waste.dto.ts
import {
  IsString,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsDateString,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export class SupplyQuantityDto {
  @ApiProperty({
    description: 'Supply ID',
    example: '507f1f77bcf86cd799439011',
    type: String,
  })
  @IsMongoId()
  supplyId: string;

  @ApiProperty({
    description: 'Quantity of waste for this supply',
    example: 5,
    type: Number,
    minimum: 1,
  })
  @IsNumber()
  quantity: number;
}

export class CreateWasteDto {
  @ApiProperty({
    description: 'Reason for the waste report',
    example: 'Product expired',
    type: String,
  })
  @IsString()
  motive: string;

  @ApiProperty({
    description: 'Array of supplies and their quantities',
    type: [SupplyQuantityDto],
    example: [
      {
        supply: '507f1f77bcf86cd799439011',
        quantity: 5,
      },
    ],
  })
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => SupplyQuantityDto)
  supplies: SupplyQuantityDto[];

  @ApiPropertyOptional({
    description: 'ID of the person reporting the waste',
    example: '507f1f77bcf86cd799439013',
    type: String,
  })
  @IsOptional()
  @IsMongoId()
  reporter: string;

  @ApiPropertyOptional({
    description: 'ID of the person responsible for the waste',
    example: '507f1f77bcf86cd799439014',
    type: String,
  })
  @IsOptional()
  @IsMongoId()
  @Transform(({ value }) => (value === '' ? undefined : value))
  responsible: string;

  @ApiProperty({
    description: 'Date when the waste occurred',
    example: '2024-03-20T12:00:00Z',
    type: Date,
  })
  @IsDateString()
  date: Date;
}
