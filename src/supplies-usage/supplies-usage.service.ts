import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSuppliesUsageDto } from './dto/create-supplies-usage.dto';
import { UpdateSuppliesUsageDto } from './dto/update-supplies-usage.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SuppliesUsage } from './schemas/supplies-usage.schema';

@Injectable()
export class SuppliesUsageService {
  constructor(
    @InjectModel(SuppliesUsage.name)
    private supplyUsageModel: Model<SuppliesUsage>,
  ) {}

  create(createSuppliesUsageDto: CreateSuppliesUsageDto) {
    const supplyUsage = new this.supplyUsageModel(createSuppliesUsageDto);
    return supplyUsage.save();
  }

  findAll() {
    return this.supplyUsageModel.find().populate('supply');
  }

  findOne(id: string) {
    return this.supplyUsageModel.findOne({ _id: id }).populate('supply');
  }

  async update(id: string, updateSuppliesUsageDto: UpdateSuppliesUsageDto) {
    const suppliesUsage = await this.findOne(id);
    if (!suppliesUsage) {
      throw new NotFoundException('supply usage not found');
    }
    Object.assign(suppliesUsage, updateSuppliesUsageDto);
    return suppliesUsage.save();
  }

  async remove(id: string) {
    const suppliesUsage = await this.findOne(id);
    if (!suppliesUsage) {
      throw new NotFoundException('supply not found');
    }
    return this.supplyUsageModel.deleteOne({ _id: id });
  }
}
