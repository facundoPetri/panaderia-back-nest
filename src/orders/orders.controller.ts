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
  BadRequestException,
  Query,
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
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { UpdateStateOrderDto } from './dto/update-status-order.dto';
import { OrderState } from './schemas/orders.schema';

@ApiBearerAuth()
@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly pdfService: PdfService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created successfully.' })
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get('generate-pdf')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename="supplies.pdf"')
  @ApiOperation({ summary: 'Generate PDF of all orders' })
  @ApiResponse({ status: 200, description: 'PDF generated successfully.' })
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
  @ApiOperation({
    summary: 'Get all orders with optional state and reported filters',
  })
  @ApiQuery({
    name: 'state',
    required: false,
    enum: OrderState,
    description: 'Filter orders by state (optional)',
  })
  @ApiQuery({
    name: 'reported',
    required: false,
    type: Boolean,
    description: 'Filter orders by reported status (optional)',
  })
  @ApiResponse({
    status: 200,
    description:
      'Returns all orders, optionally filtered by state and reported status',
  })
  findAll(
    @Query('state') state?: OrderState,
    @Query('reported') reported = false,
  ) {
    return this.ordersService.findAll(state, reported);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiResponse({ status: 200, description: 'Return the order.' })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update order by ID' })
  @ApiResponse({ status: 200, description: 'Order updated successfully.' })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Post(':id')
  @ApiOperation({ summary: 'Update order status' })
  @ApiResponse({
    status: 200,
    description: 'Order status updated successfully.',
  })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  async updateStatus(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateStateOrderDto: UpdateStateOrderDto,
  ) {
    const updatedOrder = await this.ordersService.updateState(
      id,
      updateStateOrderDto.state,
      updateStateOrderDto.cancelled_description,
    );

    if (!updatedOrder) throw new BadRequestException('Order not found');

    return updatedOrder;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete order by ID' })
  @ApiResponse({ status: 200, description: 'Order deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.ordersService.remove(id);
  }
}
