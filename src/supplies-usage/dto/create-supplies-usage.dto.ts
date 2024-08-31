import { IsNumber, IsDateString, IsMongoId } from 'class-validator';

export class CreateSuppliesUsageDto {
  @IsNumber()
  quantity: number;

  @IsMongoId()
  supply: string;

  @IsDateString()
  date_used: Date;
}
