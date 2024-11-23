import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSupplyDto } from './dto/create-supply.dto';
import { SupplyDocument, Supply } from './schemas/supply.schema';
import { BatchDocument } from '../batch/schemas/batch.schema';

@Injectable()
export class SuppliesService {
  constructor(
    @InjectModel(Supply.name) private readonly supplyModel: Model<Supply>,
  ) {}

  create(createSupplyDto: CreateSupplyDto) {
    const supply = new this.supplyModel(createSupplyDto);
    return supply.save();
  }

  async findAll() {
    const supplies = await this.supplyModel.aggregate([
      {
        $lookup: {
          from: 'batches',
          localField: '_id',
          foreignField: 'supply_id',
          as: 'batches',
          pipeline: [{ $sort: { date_of_entry: -1 } }],
        },
      },
      {
        $addFields: {
          current_stock: {
            $sum: '$batches.quantity',
          },
        },
      },
    ]);

    return this.supplyModel.populate(supplies, { path: 'usedIn' });
  }

  findOne(id: string) {
    if (!id) {
      return null;
    }
    return this.supplyModel
      .findOne({ _id: id })
      .populate(['usedIn', 'batches']);
  }

  async update(id: string, updateSupplyDto: Partial<CreateSupplyDto>) {
    const supply = await this.findOne(id);
    if (!supply) {
      throw new NotFoundException('supply not found');
    }
    Object.assign(supply, updateSupplyDto);
    return supply.save();
  }

  async addBatch(supply: SupplyDocument, batch: BatchDocument) {
    supply.batches.push(batch);
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
