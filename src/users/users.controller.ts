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
import { PdfService } from 'src/pdf/pdf.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private pdfService: PdfService,
  ) {}

  @Post()
  create(@Body() createUserDto: SignUpDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('generate-pdf')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename="filename.pdf"')
  @Public()
  async generatePdf(@Res() res: Response): Promise<void> {
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

    const buffer = await this.pdfService.generate(html);

    res.set({
      'Content-Length': buffer.length,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: 0,
    });

    res.end(buffer);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() signUpDto: Partial<SignUpDto>,
  ) {
    return this.usersService.update(id, signUpDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.usersService.remove(id);
  }
}
