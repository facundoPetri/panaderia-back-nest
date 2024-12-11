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
  ForbiddenException,
} from '@nestjs/common';
import { Response } from 'express';

import { UsersService } from './users.service';
import { ParseObjectIdPipe } from '../pipes/parse-object-id-pipe.pipe';
import { SignUpDto } from 'src/auth/dto/sign-up.dto';
import { generatePdf } from '../../helpers/handlebars';
import { PdfService } from 'src/pdf/pdf.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './schemas/user.schema';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private pdfService: PdfService,
  ) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('generate-pdf')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename="users.pdf"')
  async generatePdf(
    @Res() res: Response,
    @CurrentUser() user: User,
  ): Promise<void> {
    const users = await this.usersService.findAll();

    const html = generatePdf({
      title: 'Lista de Usuarios',
      user: user.fullname,
      data: users,
      headers: [
        'Nombre Completo',
        'Email',
        'Estado',
        'Tipo',
        'Fecha de Creación',
        'Último inicio',
      ],
      tableTemplate: 'users',
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
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateUserDto: Partial<UpdateUserDto>,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseObjectIdPipe) id: string,
    @CurrentUser() currentUser: User,
  ) {
    const user = await this.usersService.findOne(currentUser._id.toString());
    if (user.type !== 'admin')
      throw new ForbiddenException(
        'No tienes permisos para realizar esta acción',
      );

    return this.usersService.remove(id);
  }
}
