import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/orders.schema';
import { PdfService } from '../pdf/pdf.service';
import { BatchModule } from 'src/batch/batch.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    BatchModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, PdfService],
})
export class OrdersModule {}
