import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderState } from './schemas/orders.schema';
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
    order.created_at = new Date();
    return order.save();
  }

  async updateState(
    id: string,
    state: OrderState,
    cancelled_description: string = '',
  ) {
    const updatedOrder = await this.orderModel
      .findByIdAndUpdate(id, { state, cancelled_description }, { new: true })
      .exec();

    if (updatedOrder.state === OrderState.COMPLETED) {
      updatedOrder.received_date = new Date();
      await updatedOrder.save();

      updatedOrder.supplies.forEach(async (supply) => {
        await this.batchService.create({
          supply_id: supply._id.toString(),
          date_of_entry: new Date(),
          expiration_date: null,
          quantity: null,
          row: null,
          column: null,
        });
      });
    }

    return updatedOrder;
  }

  findAll(state?: OrderState) {
    const query = state ? { state } : {};

    return this.orderModel
      .find(query)
      .populate(['provider', 'supplies'])
      .exec();
  }

  findOne(id: string) {
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
