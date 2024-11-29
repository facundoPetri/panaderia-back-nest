import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { IsEnum } from 'class-validator';
import { OrderState } from '../schemas/orders.schema';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsEnum(OrderState)
  state: OrderState;
}
