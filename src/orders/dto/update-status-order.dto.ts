import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderState } from '../schemas/orders.schema';

export class UpdateStateOrderDto {
  @IsEnum(OrderState)
  state: OrderState;

  @IsOptional()
  @IsString()
  cancelled_description: string;
}
