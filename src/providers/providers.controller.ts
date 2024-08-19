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
import { ProvidersService } from './providers.service';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { ParseObjectIdPipe } from '../pipes/parse-object-id-pipe.pipe';
import { User } from 'src/users/schemas/user.schema';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { generatePdf } from 'helpers/handlebars';
import { Response } from 'express';
import { PdfService } from 'src/pdf/pdf.service';

@Controller('providers')
export class ProvidersController {
  constructor(
    private readonly providersService: ProvidersService,
    private readonly pdfService: PdfService,
  ) {}

  @Post()
  create(@Body() createProviderDto: CreateProviderDto) {
    return this.providersService.create(createProviderDto);
  }

  @Get()
  findAll() {
    return this.providersService.findAll();
  }

  @Get('generate-pdf')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename="providers.pdf"')
  async generatePdf(
    @Res() res: Response,
    @CurrentUser() user: User,
  ): Promise<void> {
    const providers = await this.providersService.findAll();

    const html = generatePdf({
      title: 'Listado de Proveedores',
      user: user.fullname,
      data: providers,
      headers: ['Nombre', 'Teléfono', 'Email', 'Insumos que entrega'],
      tableTemplate: 'providers',
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
    return this.providersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateProviderDto: UpdateProviderDto,
  ) {
    return this.providersService.update(id, updateProviderDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.providersService.remove(id);
  }
}
