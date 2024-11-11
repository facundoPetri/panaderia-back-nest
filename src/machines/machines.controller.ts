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
import { MachinesService } from './machines.service';
import { CreateMachineDto } from './dto/create-machine.dto';
import { UpdateMachineDto } from './dto/update-machine.dto';
import { ParseObjectIdPipe } from '../pipes/parse-object-id-pipe.pipe';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/schemas/user.schema';
import { generatePdf } from 'helpers/handlebars';
import { Response } from 'express';
import { PdfService } from 'src/pdf/pdf.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('machines')
export class MachinesController {
  constructor(private readonly machinesService: MachinesService, private readonly pdfService: PdfService) {}

  @Post()
  create(@Body() createMachineDto: CreateMachineDto) {
    return this.machinesService.create(createMachineDto);
  }

  @Get('generate-pdf')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename="machines.pdf"')
  async generatePdf(@Res() res: Response, @CurrentUser() user: User): Promise<void> {
    const machines = await this.machinesService.findAll();

    const html = generatePdf({
      title: 'Gestión y Mantenimiento de maquinaria',
      user: user.fullname,
      data: machines,
      headers: [
        'Nombre',
        'Fecha de adquisición',
        'Fecha del último mantenimiento',
        'Mantenimiento deseado',
        '¿Se requiere mantenimiento?',
      ],
      tableTemplate: 'machines',
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

  @Get()
  findAll() {
    return this.machinesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.machinesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateMachineDto: UpdateMachineDto,
  ) {
    return this.machinesService.update(id, updateMachineDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.machinesService.remove(id);
  }
}
