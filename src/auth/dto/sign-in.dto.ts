import { IsString, IsEmail, Length } from 'class-validator';

export class SignInDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 20)
  password: string;
}
