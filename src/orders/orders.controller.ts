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
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Response } from 'express';
import { ParseObjectIdPipe } from 'src/pipes/parse-object-id-pipe.pipe';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/schemas/user.schema';
import { generatePdf } from 'helpers/handlebars';
import { PdfService } from 'src/pdf/pdf.service';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly pdfService: PdfService,
  ) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get('generate-pdf')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename="supplies.pdf"')
  async generatePdf(
    @Res() res: Response,
    @CurrentUser() user: User,
  ): Promise<void> {
    const orders = await this.ordersService.findAll();

    const html = generatePdf({
      title: 'Listado de pedidos a proveedores',
      user: user.fullname,
      data: orders,
      headers: [
        'Número de pedido',
        'Fecha de creación',
        'Proveedor',
        'Insumos',
      ],
      tableTemplate: 'orders',
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
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.ordersService.remove(id);
  }
}
