import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument, OrderState } from './schemas/orders.schema';
import { Model } from 'mongoose';
import { BatchService } from '../batch/batch.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    private readonly batchService: BatchService,
  ) {}

  create(createOrderDto: CreateOrderDto) {
    const order = new this.orderModel(createOrderDto);
    return order.save();
  }

  async updateState(
    id: string,
    state: OrderState,
    cancelled_description: string = '',
  ) {
    const orderToUpdate = await this.orderModel
      .findById(id)
      .populate('supplies');

    if (state === OrderState.COMPLETED) {
      await Promise.all(
        orderToUpdate.supplies.map((supply) =>
          this.batchService.getAllStock(
            supply.supplyId.toString(),
            supply.quantity,
          ),
        ),
      );

      const [lastBatch] = await this.batchService.findAll(false);

      await Promise.all(
        orderToUpdate.supplies.map((supply, index) => {
          this.batchService.create({
            supply_id: supply.supplyId.toString(),
            date_of_entry: new Date(),
            expiration_date: null,
            quantity: supply.quantity,
            row: null,
            column: null,
            batch_number: lastBatch.batch_number + (index + 1),
          });
        }),
      );

      orderToUpdate.received_date = new Date();
      await orderToUpdate.save();
    }

    orderToUpdate.state = state;
    orderToUpdate.cancelled_description = cancelled_description;
    await orderToUpdate.save();

    return orderToUpdate;
  }

  findAll(state?: OrderState, reported = false) {
    let query: any = {};

    if (state) query.state = state;

    if (reported) query.reported = reported;

    return this.orderModel
      .find(query)
      .sort({ number: -1 })
      .populate([
        {
          path: 'supplies.supplyId',
          model: 'Supply',
          select: 'name quantity',
        },
        {
          path: 'provider',
          model: 'Provider',
        },
      ])
      .exec();
  }

  findOne(id: string): Promise<OrderDocument> {
    return this.orderModel
      .findOne({ _id: id })
      .populate(['provider', 'supplies'])
      .exec();
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.findOne(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    if (order.state !== OrderState.CREATED) {
      throw new BadRequestException('Order cannot be updated');
    }
    Object.assign(order, updateOrderDto);
    return order.save();
  }

  async remove(id: string) {
    const order = await this.findOne(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return this.orderModel.deleteOne({ _id: id });
  }
}
