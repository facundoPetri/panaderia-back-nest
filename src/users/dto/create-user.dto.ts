export class CreateUserDto {
  fullname: string;
  email: string;
  password: string;
  type: string;
  createdAt: Date;
  lastSession: Date;
  state: boolean;
  image: string;
}
