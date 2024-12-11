import {
  IsNotEmpty,
  IsString,
  Length,
  IsOptional,
  IsUrl,
  IsEnum,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { UserRole } from 'src/auth/dto/sign-up.dto';

export class UpdateUserDto {
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
