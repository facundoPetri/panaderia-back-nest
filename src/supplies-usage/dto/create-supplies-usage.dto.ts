import { IsNumber, IsDateString, IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateSuppliesUsageDto {
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsMongoId()
  supply: string;

  @IsNotEmpty()
  @IsDateString()
  date_used: Date;
}
