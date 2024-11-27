import {
  IsMongoId,
  IsDateString,
  IsOptional,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Types } from 'mongoose';
import { SupplyQuantityDto } from '../../waste/dto/create-waste.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @IsMongoId()
  provider: Types.ObjectId;

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

  @IsDateString()
  @IsOptional()
  created_at?: string;
}
