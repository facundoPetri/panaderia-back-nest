import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBatchDto } from './dto/create-batch.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Batch } from './schemas/batch.schema';
import { Model, Types } from 'mongoose';
import { CreateSuppliesUsageDto } from 'src/supplies-usage/dto/create-supplies-usage.dto';
import { SuppliesService } from 'src/supplies/supplies.service';

@Injectable()
export class BatchService {
  constructor(
    @InjectModel(Batch.name) private readonly batchModel: Model<Batch>,
    private readonly suppliesService: SuppliesService,
  ) {}

  create(createBatchDto: CreateBatchDto) {
    const batch = new this.batchModel(createBatchDto);
    return batch.save();
  }

  bulkCreate(createBatchDtos: CreateBatchDto[]) {
    const batches = createBatchDtos.map((dto) => new this.batchModel(dto));
    return this.batchModel.insertMany(batches);
  }

  async getAllStock(supplyId: string, quantity: number) {
    const [allStock] = await this.batchModel
      .aggregate([
        {
          $match: { supply_id: new Types.ObjectId(supplyId) },
        },
        {
          $group: {
            _id: '$supply_id',
            totalQuantity: { $sum: '$quantity' },
            batches: { $push: '$$ROOT' },
          },
        },
        {
          $lookup: {
            from: 'supplies',
            localField: '_id',
            foreignField: '_id',
            as: 'supply',
          },
        },
        {
          $unwind: '$supply',
        },
      ])
      .exec();

    if (
      allStock &&
      allStock.totalQuantity + quantity > allStock.supply.max_stock
    ) {
      throw new BadRequestException(
        'Este pedido supera el stock máximo permitido para este producto',
      );
    }

    return allStock ?? 0;
  }

  async updateBatchQuantities(suppliesUsages: CreateSuppliesUsageDto[]) {
    let supplyNames = '';
    for (const supplyUsage of suppliesUsages) {
      const { supply, quantity } = supplyUsage;

      const batches = await this.batchModel
        .find({ supply_id: supply, quantity: { $gt: 0 } })
        .sort({ expiration_date: 1 })
        .exec();

      const totalQuantity = batches.reduce(
        (acc, batch) => acc + batch.quantity,
        0,
      );

      if (quantity > totalQuantity) {
        const supplyName =
          batches[0]?.supply_id?.name ||
          (await this.suppliesService.findOne(supply)).name;
        supplyNames += `${supplyNames.length ? ', ' : ''}${supplyName}`;
      }
    }

    if (supplyNames.length) {
      throw new BadRequestException(
        `No hay suficiente stock para los siguientes productos: ${supplyNames}`,
      );
    }

    for (const supplyUsage of suppliesUsages) {
      const { supply, quantity } = supplyUsage;

      const batches = await this.batchModel
        .find({ supply_id: supply, quantity: { $gt: 0 } })
        .sort({ expiration_date: 1 })
        .exec();

      let remainingQuantity = quantity;

      for (const batch of batches) {
        if (remainingQuantity <= 0) break;

        const subtractAmount = Math.min(batch.quantity, remainingQuantity);
        batch.quantity -= subtractAmount;
        remainingQuantity -= subtractAmount;
        await batch.save();
      }
    }
  }

  findAll(expiring: boolean, days = 7) {
    if (expiring) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const limitDate = new Date();
      limitDate.setDate(limitDate.getDate() + days);

      return this.batchModel
        .find({
          expiration_date: {
            $gte: today,
            $lte: limitDate,
          },
        })
        .sort({ expiration_date: 1 })
        .populate('supply_id')
        .lean()
        .exec();
    }
    return this.batchModel
      .find()
      .populate('supply_id')
      .sort({
        batch_number: -1,
      })
      .lean()
      .exec();
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
