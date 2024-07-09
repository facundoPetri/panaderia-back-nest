import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  IsOptional,
  IsUrl,
  IsEnum,
} from 'class-validator';
import { Transform } from 'class-transformer';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  BLOGGER = 'blogger',
}

export class SignUpDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  password: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 50)
  fullname: string;

  @IsNotEmpty()
  @Transform(({ value }) => ('' + value).toLowerCase())
  @IsEnum(UserRole)
  type: UserRole;

  @IsOptional()
  @IsUrl()
  image: string;
}
