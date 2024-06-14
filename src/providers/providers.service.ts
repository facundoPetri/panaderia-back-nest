import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { Provider } from './schemas/provider.schema';

@Injectable()
export class ProvidersService {
  constructor(@InjectModel(Provider.name) private providerModel: Model<Provider>) {}

  create(createProviderDto: CreateProviderDto) {
    const provider = new this.providerModel(createProviderDto);
    return provider.save();
  }

  findAll() {
    return this.providerModel.find();
  }

  findOne(id: string) {
    return this.providerModel.find({ _id: id });
  }

  update(id: string, updateProviderDto: UpdateProviderDto) {
    return `This action updates a #${id} provider`;
  }

  remove(id: string) {
    return `This action removes a #${id} provider`;
  }
}
