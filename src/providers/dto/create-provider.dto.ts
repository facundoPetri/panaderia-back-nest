import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsUrl,
  Length,
  IsMongoId,
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
  @IsUrl()
  image?: string;

  @IsString()
  @IsOptional()
  estimated_delivery_time: string;
}
