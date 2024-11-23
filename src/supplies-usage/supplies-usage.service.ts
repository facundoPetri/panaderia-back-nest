import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSuppliesUsageDto } from './dto/create-supplies-usage.dto';
import { UpdateSuppliesUsageDto } from './dto/update-supplies-usage.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SuppliesUsage } from './schemas/supplies-usage.schema';
import { BatchService } from 'src/batch/batch.service';

@Injectable()
export class SuppliesUsageService {
  constructor(
    @InjectModel(SuppliesUsage.name)
    private readonly supplyUsageModel: Model<SuppliesUsage>,
    private readonly batchService: BatchService,
  ) {}

  async create(createSuppliesUsageDtos: CreateSuppliesUsageDto[]) {
    const supplyUsages = createSuppliesUsageDtos.map(
      (dto) => new this.supplyUsageModel(dto),
    );

    await this.batchService.updateBatchQuantities(createSuppliesUsageDtos);

    return this.supplyUsageModel.insertMany(supplyUsages);
  }

  findAll(days: string) {
    const daysNumber = parseInt(days, 10);
    const adjustedDate = new Date();
    adjustedDate.setDate(adjustedDate.getDate() - daysNumber);

    if (days) {
      return this.supplyUsageModel
        .find({
          date_used: {
            $gte: adjustedDate,
          },
        })
        .populate('supply');
    }
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
