import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  Length,
  IsMongoId,
  IsNumber,
} from 'class-validator';

export class CreateProviderDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  phone: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsMongoId({ each: true })
  supplies: string[];

  @IsOptional()
  @IsString()
  image?: string;

  @IsNumber()
  estimated_delivery_time: number;
}
