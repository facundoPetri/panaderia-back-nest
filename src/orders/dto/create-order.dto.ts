import { IsNumber, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class CreateOrderDto {
    @IsNumber()
    number: number;
  
    @IsMongoId()
    provider: Types.ObjectId;
  
    @IsMongoId({ each: true })
    supplies: Types.ObjectId[];
}
