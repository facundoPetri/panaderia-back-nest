import { IsNumber, IsDateString, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class CreateOrderDto {
    @IsNumber()
    number: number;
  
    @IsDateString()
    date: Date;
  
    @IsMongoId()
    provider: Types.ObjectId;
  
    @IsMongoId({ each: true })
    supplies: Types.ObjectId[];
}
