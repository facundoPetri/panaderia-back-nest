import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductionDto } from './dto/create-production.dto';
import { UpdateProductionDto } from './dto/update-production.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Production } from './schemas/production.schema';
import { Model } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class ProductionService {
  constructor(
    @InjectModel(Production.name)
    private readonly productionModel: Model<Production>,
  ) {}

  create(createProductionDto: CreateProductionDto, currentUser: User) {
    const production = new this.productionModel(createProductionDto);
    production.user = currentUser;
    return production.save();
  }

  findAll() {
    return this.productionModel
      .find()
      .populate(['recipe', 'user', 'machine'])
      .exec();
  }

  findOne(id: string) {
    return this.productionModel
      .findOne({ _id: id })
      .populate(['recipe', 'user', 'machine'])
      .exec();
  }

  async update(id: string, updateProductionDto: UpdateProductionDto) {
    const prod = await this.findOne(id);
    if (!prod) {
      throw new NotFoundException('Informe no encontrado');
    }
    Object.assign(prod, updateProductionDto);
    return prod.save();
  }

  async remove(id: string) {
    const prod = await this.findOne(id);
    if (!prod) throw new NotFoundException('Informe no encontrado');

    return this.productionModel.deleteOne({ _id: id });
  }
}
