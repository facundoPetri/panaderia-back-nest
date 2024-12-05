import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNumber, IsString } from 'class-validator';

export class CreateReportingOrderDto {
  @ApiProperty({ description: 'Order name', example: 1 })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Order ID' })
  @IsMongoId()
  order: string;

  @ApiProperty({ description: 'Quality details' })
  @IsString()
  quality_details: string;

  @ApiProperty({ description: 'Quality rank' })
  @IsNumber()
  quality: number;
}
