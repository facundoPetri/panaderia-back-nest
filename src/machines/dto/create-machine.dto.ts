import {
  IsString,
  IsNotEmpty,
  Length,
  IsDate,
  IsNumber,
  IsMongoId,
  IsDateString,
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
}
