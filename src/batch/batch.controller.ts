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
import { BatchService } from './batch.service';
import { CreateBatchDto } from './dto/create-batch.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';
import { ParseObjectIdPipe } from '../pipes/parse-object-id-pipe.pipe';
import { SuppliesService } from 'src/supplies/supplies.service';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/schemas/user.schema';
import { generatePdf } from 'helpers/handlebars';
import { Response } from 'express';
import { PdfService } from 'src/pdf/pdf.service';

@Controller('batch')
export class BatchController {
  constructor(
    private readonly batchService: BatchService,
    private readonly suppliesService: SuppliesService,
    private readonly pdfService: PdfService,
  ) {}

  @Post()
  async create(@Body() createBatchDto: CreateBatchDto) {
    const supply = await this.suppliesService.findOne(createBatchDto.supply_id);
    if (!supply) {
      throw new Error('insumo no encontrado');
    }
    const batch = await this.batchService.create(createBatchDto);
    await this.suppliesService.addBatch(supply, batch);
    return batch;
  }

  @Get('generate-pdf')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename="supplies.pdf"')
  async generatePdf(
    @Res() res: Response,
    @CurrentUser() user: User,
  ): Promise<void> {
    const batches = await this.batchService.findAll();
    console.log("🚀 ~ batches:", batches)

    const html = generatePdf({
      title: 'Listado de insumos con vencimiento próximo',
      user: user.fullname,
      data: batches,
      headers: [
        'Fecha de vencimiento',
        'Nombre',
        'Tiempo estimado de entrega',
        'Ubicación',
        'Cantidad',
      ],
      tableTemplate: 'expiring',
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
    return this.batchService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.batchService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateBatchDto: UpdateBatchDto,
  ) {
    return this.batchService.update(id, updateBatchDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.batchService.remove(id);
  }
}
