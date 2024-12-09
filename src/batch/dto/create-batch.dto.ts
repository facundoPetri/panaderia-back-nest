import { IsNumber, IsDateString, IsMongoId, IsOptional } from 'class-validator';

export class CreateBatchDto {
  @IsOptional()
  @IsNumber()
  batch_number?: number;

  @IsDateString()
  expiration_date: Date;

  @IsDateString()
  date_of_entry: Date;

  @IsNumber()
  quantity: number;

  @IsNumber()
  row: number;

  @IsNumber()
  column: number;

  @IsMongoId()
  supply_id: string;
}
