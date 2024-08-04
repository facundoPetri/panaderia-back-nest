import { IsNumber, IsDateString, IsMongoId } from 'class-validator';

export class CreateBatchDto {
  @IsDateString()
  expiration_date: Date;

  @IsDateString()
  date_of_entry: Date;

  @IsNumber()
  quantity: number;

  @IsNumber()
  batch_number: number;

  @IsNumber()
  row: number;

  @IsNumber()
  column: number;

  @IsMongoId()
  supply_id: string;
}
