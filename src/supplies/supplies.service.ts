import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSupplyDto } from './dto/create-supply.dto';
import { SupplyDocument, Supply } from './schemas/supply.schema';
import { BatchDocument } from '../batch/schemas/batch.schema';
import { RecipeDocument } from 'src/recipes/schemas/recipe.schema';

@Injectable()
export class SuppliesService {
  constructor(
    @InjectModel(Supply.name) private readonly supplyModel: Model<Supply>,
  ) {}

  async create(createSupplyDto: CreateSupplyDto) {
    const existingSupply = await this.supplyModel.findOne({
      name: createSupplyDto.name,
    });

    if (existingSupply)
      throw new BadRequestException('Ya existe un insumo con este nombre');

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

  async findSupplies(ids: string[]) {
    return this.supplyModel.find({ _id: { $in: ids } });
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
    if (!supply) throw new NotFoundException('Insumo no encontrado');

    Object.assign(supply, updateSupplyDto);
    return supply.save();
  }

  async updateUsedIn(recipe: RecipeDocument, suppliesIds: string[]) {
    const supplies = await this.findSupplies(suppliesIds);
    supplies.forEach((supply) => {
      supply.usedIn.push(recipe);
      supply.save();
    });
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
