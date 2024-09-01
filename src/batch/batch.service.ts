import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBatchDto } from './dto/create-batch.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Batch } from './schemas/batch.schema';
import { Model } from 'mongoose';

@Injectable()
export class BatchService {
  constructor(
    @InjectModel(Batch.name) private readonly batchModel: Model<Batch>,
  ) {}

  create(createBatchDto: CreateBatchDto) {
    const batch = new this.batchModel(createBatchDto);
    return batch.save();
  }

  findAll() {
    return this.batchModel.find().populate('supply_id').lean().exec();
  }

  findOne(id: string) {
    return this.batchModel.findOne({ _id: id }).populate('supply_id').exec();
  }

  async update(id: string, updateBatchDto: UpdateBatchDto) {
    const batch = await this.findOne(id);
    if (!batch) {
      throw new NotFoundException('Batch not found');
    }
    Object.assign(batch, updateBatchDto);
    return batch.save();
  }

  async remove(id: string) {
    const batch = await this.findOne(id);
    if (!batch) {
      throw new NotFoundException('Batch not found');
    }
    return this.batchModel.deleteOne({ _id: id });
  }
}
