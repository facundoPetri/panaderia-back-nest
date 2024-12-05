import { Module } from '@nestjs/common';
import { ReportingOrdersService } from './reporting_orders.service';
import { ReportingOrdersController } from './reporting_orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ReportingOrder,
  ReportingOrderSchema,
} from './schemas/reporting_orders.schema';
import { OrdersModule } from 'src/orders/orders.module';
import { ProvidersModule } from 'src/providers/providers.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ReportingOrder.name, schema: ReportingOrderSchema },
    ]),
    OrdersModule,
    ProvidersModule,
  ],
  controllers: [ReportingOrdersController],
  providers: [ReportingOrdersService],
})
export class ReportingOrdersModule {}
