import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReportingOrderDto } from './dto/create-reporting_order.dto';
import { UpdateReportingOrderDto } from './dto/update-reporting_order.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  ReportingOrder,
  ReportingOrderDocument,
} from './schemas/reporting_orders.schema';
import { Model } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import { OrderState } from 'src/orders/schemas/orders.schema';
import { OrdersService } from 'src/orders/orders.service';
import { ProvidersService } from 'src/providers/providers.service';

@Injectable()
export class ReportingOrdersService {
  constructor(
    @InjectModel(ReportingOrder.name)
    private readonly reportingOrderModel: Model<ReportingOrder>,
    private readonly orderService: OrdersService,
    private readonly providerService: ProvidersService,
  ) {}

  async create(createReportingOrderDto: CreateReportingOrderDto, user: User) {
    const order = await this.orderService.findOne(
      createReportingOrderDto.order,
    );

    if (!order) throw new NotFoundException('Pedido no encontrado');

    if (order.state !== OrderState.COMPLETED)
      throw new BadRequestException(
        'El pedido debe estar completado para poder reportarlo',
      );

    if (order.reported) throw new BadRequestException('Pedido ya reportado');

    const supplies = order.supplies.map((supply) => supply.supplyId);

    const estimatedDate = new Date(order.created_at);
    const { estimated_delivery_time } = await this.providerService.findOne(
      order.provider._id.toString(),
    );
    estimatedDate.setDate(estimatedDate.getDate() + estimated_delivery_time);

    const createdReportingOrder = new this.reportingOrderModel({
      ...createReportingOrderDto,
      estimated_date: estimatedDate,
      author: user,
      provider: order.provider,
      supplies,
    });

    order.reported = true;
    await order.save();

    return await createdReportingOrder.save();
  }

  async findAll(): Promise<(ReportingOrder & { _id: any })[]> {
    try {
      return await this.reportingOrderModel
        .find()
        .populate([
          {
            path: 'order',
            select: 'number state received_date created_at',
          },
          {
            path: 'provider',
            select: 'name phone email',
          },
          {
            path: 'supplies',
            select: 'name quantity',
          },
          {
            path: 'author',
            select: 'fullname email',
          },
        ])
        .sort({ created_at: -1 })
        .lean()
        .exec();
    } catch (error) {
      throw new Error(`Failed to fetch reporting orders: ${error.message}`);
    }
  }

  findOne(id: string): Promise<ReportingOrder> {
    try {
      return this.reportingOrderModel
        .findById(id)
        .populate([
          {
            path: 'order',
            select: 'number state received_date',
          },
          {
            path: 'provider',
            select: 'name phone email',
          },
          {
            path: 'supplies',
            select: 'name quantity',
          },
          {
            path: 'author',
            select: 'fullname email',
          },
        ])
        .exec();
    } catch (error) {
      throw new Error(`Failed to fetch reporting order: ${error.message}`);
    }
  }

  async update(
    id: string,
    updateReportingOrderDto: UpdateReportingOrderDto,
  ): Promise<ReportingOrderDocument | null> {
    try {
      const reportingOrder = await this.reportingOrderModel.findById(id);

      if (!reportingOrder) {
        throw new NotFoundException(`Reporting order #${id} not found`);
      }

      const updatedReportingOrder = await this.reportingOrderModel
        .findByIdAndUpdate(
          id,
          {
            ...updateReportingOrderDto,
          },
          { new: true },
        )
        .exec();

      return updatedReportingOrder;
    } catch (error) {
      throw new Error(`Failed to update reporting order: ${error.message}`);
    }
  }

  async remove(id: string) {
    const reporting = await this.findOne(id);
    if (!reporting) {
      throw new NotFoundException(`Reporting order #${id} not found`);
    }
    return this.reportingOrderModel.deleteOne({ _id: id });
  }
}
