import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schemas/orders.schema';
import { Model } from 'mongoose';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
  ) {}

  create(createOrderDto: CreateOrderDto) {
    const order = new this.orderModel(createOrderDto);
    return order.save();
  }

  findAll() {
    return this.orderModel.find().populate(['provider', 'supplies']).exec();
  }

  findOne(id: string) {
    return this.orderModel.findOne({ _id: id }).populate(['provider', 'supplies']).exec();
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.findOne(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    Object.assign(order, updateOrderDto);
    return order.save();
  }

  remove(id: string) {
    const order = this.findOne(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return this.orderModel.deleteOne({ _id: id });
  }
}
