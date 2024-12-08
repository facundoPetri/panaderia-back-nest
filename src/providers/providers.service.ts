import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { Provider } from './schemas/provider.schema';

@Injectable()
export class ProvidersService {
  constructor(
    @InjectModel(Provider.name) private providerModel: Model<Provider>,
  ) {}

  async create(createProviderDto: CreateProviderDto) {
    const existingProvider = await this.providerModel.findOne({
      name: createProviderDto.name,
    });

    if (existingProvider)
      throw new BadRequestException('Ya existe un proveedor con este nombre');

    const provider = new this.providerModel(createProviderDto);
    return provider.save();
  }

  findAll(): Promise<Provider[]> {
    return this.providerModel.find().populate('supplies').lean().exec();
  }

  findOne(id: string) {
    return this.providerModel.findOne({ _id: id }).populate('supplies').exec();
  }

  async update(id: string, updateProviderDto: UpdateProviderDto) {
    const provider = await this.findOne(id);
    Object.assign(provider, updateProviderDto);
    return provider.save();
  }

  async remove(id: string) {
    const provider = await this.findOne(id);
    if (!provider) {
      return null;
    }
    return this.providerModel.deleteOne({ _id: id });
  }
}
