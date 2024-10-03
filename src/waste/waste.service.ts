import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWasteDto } from './dto/create-waste.dto';
import { UpdateWasteDto } from './dto/update-waste.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Waste } from './schemas/waste.schema';
import { Model } from 'mongoose';

@Injectable()
export class WasteService {
  constructor(
    @InjectModel(Waste.name) private readonly wasteModel: Model<Waste>,
  ) {}

  create(createWasteDto: CreateWasteDto) {
    const waste = new this.wasteModel(createWasteDto);
    return waste.save();
  }

  findAll() {
    return this.wasteModel
      .find()
      .populate(['supplies', 'reporter', 'responsible'])
      .lean()
      .exec();
  }

  findOne(id: string) {
    if (!id) {
      return null;
    }
    return this.wasteModel
      .findOne({ _id: id })
      .populate(['supplies', 'reporter', 'responsible'])
      .exec();
  }

  async update(id: string, updateWasteDto: UpdateWasteDto) {
    const waste = await this.findOne(id);
    if (!waste) {
      throw new NotFoundException('Waste not found');
    }
    Object.assign(waste, updateWasteDto);
    return waste.save();
  }

  async remove(id: string) {
    const waste = await this.findOne(id);
    if (!waste) {
      throw new NotFoundException('Waste not found');
    }
    return waste.deleteOne({ _id: id });
  }
}
