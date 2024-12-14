import {
  ArrayMinSize,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { OrderState } from '../schemas/orders.schema';
import { Type } from 'class-transformer';
import { SupplyQuantityDto } from 'src/waste/dto/create-waste.dto';

export class UpdateStateOrderDto {
  @IsEnum(OrderState)
  state: OrderState;

  @IsOptional()
  @IsString()
  cancelled_description: string;

  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => SupplyQuantityDto)
  supplies: SupplyQuantityDto[];
}
