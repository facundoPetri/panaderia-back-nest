import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  password: string;

  // fullname: string;
  // type: string;
  // createdAt: Date;
  // lastSession: Date;
  // state: boolean;
  // image: string;
}
