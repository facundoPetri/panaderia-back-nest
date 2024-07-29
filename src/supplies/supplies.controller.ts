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
import { Response } from 'express';
import { SuppliesService } from './supplies.service';
import { CreateSupplyDto } from './dto/create-supply.dto';
import { UpdateSupplyDto } from './dto/update-supply.dto';
import { ParseObjectIdPipe } from '../pipes/parse-object-id-pipe.pipe';
import { PdfService } from 'src/pdf/pdf.service';
import { Public } from '../auth/decorators/public.decorator';
import { generatePdf } from '../../helpers/handlebars';

@Controller('supplies')
export class SuppliesController {
  constructor(
    private readonly suppliesService: SuppliesService,
    private readonly pdfService: PdfService,
  ) {}

  @Post()
  create(@Body() createSupplyDto: CreateSupplyDto) {
    return this.suppliesService.create(createSupplyDto);
  }

  @Get('generate-pdf')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename="supplies.pdf"')
  @Public()
  async generatePdf(@Res() res: Response): Promise<void> {
    const supplies = await this.suppliesService.findAll();

    const html = generatePdf({
      title: 'Lista de Recetas',
      user: 'John Doe',
      data: supplies,
      headers: [
        'Nombre',
        'Fecha de ultima carga',
        'Stock actual',
        'Descripción',
      ],
      tableTemplate: 'supplies',
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
    return this.suppliesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.suppliesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateSupplyDto: Partial<CreateSupplyDto>,
  ) {
    return this.suppliesService.update(id, updateSupplyDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.suppliesService.remove(id);
  }
}
