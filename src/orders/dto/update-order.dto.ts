import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderState } from '../schemas/orders.schema';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsOptional()
  @IsEnum(OrderState)
  state?: OrderState;

  @IsOptional()
  @IsString()
  cancelled_description?: string;
}
