import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWasteDto } from './dto/create-waste.dto';
import { UpdateWasteDto } from './dto/update-waste.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Waste } from './schemas/waste.schema';
import { Model } from 'mongoose';
import { BatchService } from 'src/batch/batch.service';
import { SuppliesService } from 'src/supplies/supplies.service';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class WasteService {
  constructor(
    @InjectModel(Waste.name) private readonly wasteModel: Model<Waste>,
    private readonly batchService: BatchService,
    private readonly suppliesService: SuppliesService,
  ) {}

  async create(createWasteDto: CreateWasteDto, user: User) {
    const supplies = await this.suppliesService.findSupplies(
      createWasteDto.supplies.map((supply) => supply.supplyId),
    );

    if (supplies.length !== createWasteDto.supplies.length) {
      throw new NotFoundException('Supply not found');
    }

    const waste = new this.wasteModel(createWasteDto);
    if (!waste.reporter) waste.reporter = user;

    const batchToDecrease = createWasteDto.supplies.map((supply) => ({
      supply: supply.supplyId,
      quantity: supply.quantity ?? 1,
      date_used: createWasteDto.date,
    }));

    await this.batchService.updateBatchQuantities(batchToDecrease);

    return waste.save();
  }

  findAll() {
    return this.wasteModel
      .find()
      .populate([
        {
          path: 'supplies.supplyId',
          model: 'Supply',
          select: 'name quantity',
        },
        {
          path: 'reporter',
          model: 'User',
        },
        {
          path: 'responsible',
          model: 'User',
        },
      ])
      .sort({ date: -1 })
      .lean()
      .exec();
  }

  findOne(id: string) {
    if (!id) {
      return null;
    }
    return this.wasteModel
      .findOne({ _id: id })
      .populate([
        {
          path: 'supplies.supplyId',
          model: 'Supply',
          select: 'name quantity',
        },
        {
          path: 'reporter',
          model: 'User',
          select: 'fullname email',
        },
        {
          path: 'responsible',
          model: 'User',
          select: 'fullname email',
        },
      ])
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
