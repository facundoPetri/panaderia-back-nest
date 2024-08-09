import { IsString, IsDateString, IsMongoId } from 'class-validator';

export class CreateMaintenanceDto {
  @IsString()
  description: string;

  @IsDateString()
  date: string;

  @IsMongoId()
  machine: string;
}
