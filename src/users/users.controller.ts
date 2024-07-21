import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Header,
  Res,
} from '@nestjs/common';
import puppeteer from 'puppeteer';
import { Response } from 'express';

import { UsersService } from './users.service';
import { ParseObjectIdPipe } from '../pipes/parse-object-id-pipe.pipe';
import { SignUpDto } from 'src/auth/dto/sign-up.dto';
import { Public } from '../auth/decorators/public.decorator';
import { generatePdf } from '../../helpers/handlebars';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: SignUpDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('generate-pdf')
  @Header('content-type', 'application/pdf')
  @Header('content-disposition', 'attachment; filename=download.pdf')
  @Public()
  async generatePdf(@Res() res: Response) {
    const users = await this.usersService.findAll();

    const html = generatePdf({
      title: 'Lista de Usuarios',
      user: 'John Doe',
      data: users,
      headers: [
        'Nombre Completo',
        'Email',
        'Estado',
        'Tipo',
        'Fecha de Creación',
        'Último inicio',
      ],
    });

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);
    const pdf = await page.pdf({ format: 'A4' });
    await browser.close();

    res.send(pdf);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseObjectIdPipe) id: string) {
    return this.usersService.update(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.usersService.remove(id);
  }
}
