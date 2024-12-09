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
  Query,
} from '@nestjs/common';
import { Response } from 'express';
import { SuppliesService } from './supplies.service';
import { CreateSupplyDto } from './dto/create-supply.dto';
import { ParseObjectIdPipe } from '../pipes/parse-object-id-pipe.pipe';
import { PdfService } from 'src/pdf/pdf.service';
import { generatePdf } from '../../helpers/handlebars';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/schemas/user.schema';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('supplies')
@Controller('supplies')
export class SuppliesController {
  constructor(
    private readonly suppliesService: SuppliesService,
    private readonly pdfService: PdfService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new supply' })
  @ApiResponse({ status: 201, description: 'Supply created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createSupplyDto: CreateSupplyDto) {
    return this.suppliesService.create(createSupplyDto);
  }

  @Get('generate-pdf')
  @ApiOperation({ summary: 'Generate PDF of all supplies' })
  @ApiResponse({ status: 200, description: 'PDF generated successfully.' })
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename="supplies.pdf"')
  async generatePdf(
    @Res() res: Response,
    @CurrentUser() user: User,
  ): Promise<void> {
    const supplies = await this.suppliesService.findAll();

    const html = generatePdf({
      title: 'Listado de Insumos',
      user: user.fullname,
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
  @ApiOperation({ summary: 'Get all supplies' })
  @ApiQuery({
    name: 'order_by',
    required: false,
    enum: ['name', 'current_stock'],
    description: 'Order supplies by field',
  })
  @ApiResponse({ status: 200, description: 'Return all supplies.' })
  findAll(@Query('order_by') order_by?: string) {
    return this.suppliesService.findAll(order_by);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get supply by ID' })
  @ApiResponse({ status: 200, description: 'Return the supply.' })
  @ApiResponse({ status: 404, description: 'Supply not found.' })
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.suppliesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update supply by ID' })
  @ApiResponse({ status: 200, description: 'Supply updated successfully.' })
  @ApiResponse({ status: 404, description: 'Supply not found.' })
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateSupplyDto: Partial<CreateSupplyDto>,
  ) {
    return this.suppliesService.update(id, updateSupplyDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete supply by ID' })
  @ApiResponse({ status: 200, description: 'Supply deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Supply not found.' })
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.suppliesService.remove(id);
  }
}
