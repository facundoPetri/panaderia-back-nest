import {
  Body,
  Controller,
  Post,
  Get,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { Public } from './decorators/public.decorator';
import { ApiBody } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('login')
  @ApiBody({
    description: 'Login credentials',
    examples: {
      loginExample: {
        value: {
          email: 'asd4@asd.com',
          password: '123456',
        },
      },
    },
  })
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('/signup')
  async signUp(@Body() body: SignUpDto) {
    const user = await this.authService.signUp(
      body.email,
      body.password,
      body.fullname,
      body.type,
      body.image,
    );

    return user;
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
