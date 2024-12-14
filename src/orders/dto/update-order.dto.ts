import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { ArrayMinSize, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { SupplyQuantityDto } from 'src/waste/dto/create-waste.dto';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => SupplyQuantityDto)
  supplies: SupplyQuantityDto[];
}
