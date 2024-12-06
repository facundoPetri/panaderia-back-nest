import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { User } from '../users/schemas/user.schema';
import { UserRole } from './dto/sign-up.dto';
import { UserResponse } from './interfaces/user-response.interface';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string): Promise<UserResponse> {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new BadRequestException('Credenciales inválidas');
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Credenciales inválidas');
    }

    user.lastSession = new Date();
    user.save();

    const access_token = await this.generateToken(user);

    return {
      fullname: user.fullname,
      type: user.type,
      image: user.image,
      email,
      access_token,
    };
  }

  async signUp(
    email: string,
    password: string,
    fullname: string,
    type: UserRole,
    image?: string,
  ): Promise<UserResponse> {
    const user = await this.usersService.findOneByEmail(email);
    if (user) {
      throw new BadRequestException('Email in use');
    }

    const salt = randomBytes(8).toString('hex');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    const result = salt + '.' + hash.toString('hex');

    const createdUser = await this.usersService.create({
      fullname,
      type,
      image,
      email,
      password: result,
    });

    const access_token = await this.generateToken(createdUser);

    return {
      fullname,
      type,
      image,
      email,
      access_token,
    };
  }

  generateToken({ email, _id, fullname }: User) {
    const payload = { email, sub: _id, fullname };
    return this.jwtService.signAsync(payload);
  }
}
