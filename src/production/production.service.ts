import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductionDto } from './dto/create-production.dto';
import { UpdateProductionDto } from './dto/update-production.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Production } from './schemas/production.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProductionService {
  constructor(
    @InjectModel(Production.name)
    private readonly productionModel: Model<Production>,
  ) {}

  create(createProductionDto: CreateProductionDto) {
    const production = new this.productionModel(createProductionDto);
    return production.save();
  }

  findAll() {
    return this.productionModel.find().populate(['recipe', 'user']).exec();
  }

  findOne(id: string) {
    return this.productionModel
      .findOne({ _id: id })
      .populate(['recipe', 'user'])
      .exec();
  }

  async update(id: string, updateProductionDto: UpdateProductionDto) {
    const prod = await this.findOne(id);
    if (!prod) {
      throw new NotFoundException('Order not found');
    }
    Object.assign(prod, updateProductionDto);
    return prod.save();
  }

  remove(id: string) {
    const order = this.findOne(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return this.productionModel.deleteOne({ _id: id });
  }
}
