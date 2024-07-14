import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSupplyDto } from './dto/create-supply.dto';
import { UpdateSupplyDto } from './dto/update-supply.dto';
import { Supply } from './schemas/supply.schema';

@Injectable()
export class SuppliesService {
  constructor(@InjectModel(Supply.name) private supplyModel: Model<Supply>) {}

  create(createSupplyDto: CreateSupplyDto) {
    const supply = new this.supplyModel(createSupplyDto);
    return supply.save();
  }

  findAll() {
    return this.supplyModel.find().populate('usedIn');
  }

  findOne(id: string) {
    if (!id) {
      return null;
    }
    return this.supplyModel.findOne({ _id: id }).populate('usedIn');
  }

  async update(id: string, updateSupplyDto: UpdateSupplyDto) {
    const supply = await this.findOne(id);
    if (!supply) {
      throw new NotFoundException('supply not found');
    }
    Object.assign(supply, updateSupplyDto);
    return supply.save();
  }

  async remove(id: string) {
    const supply = await this.findOne(id);
    if (!supply) {
      throw new NotFoundException('supply not found');
    }
    return this.supplyModel.deleteOne({ _id: id });
  }
}
