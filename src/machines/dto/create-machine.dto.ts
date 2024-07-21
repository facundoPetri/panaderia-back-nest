import {
  IsString,
  IsNotEmpty,
  Length,
  IsNumber,
  IsMongoId,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class CreateMachineDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 500)
  description: string;

  @IsDateString()
  purcharse_date: string;

  @IsNumber()
  desired_maintenance: number;

  @IsMongoId()
  user_id: string;

  @IsDateString()
  @IsOptional()
  last_maintenance_date: string;
}
