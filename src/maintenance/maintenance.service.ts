import { Injectable } from '@nestjs/common';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Maintenance } from './schemas/maintenance.schema';
import { Model } from 'mongoose';

@Injectable()
export class MaintenanceService {
  constructor(
    @InjectModel(Maintenance.name) private maintenanceModel: Model<Maintenance>,
  ) {}
  
  create(createMaintenanceDto: CreateMaintenanceDto, user: any) {
    const maintenance = new this.maintenanceModel(createMaintenanceDto);
    maintenance.user = user._id;
    return maintenance.save();
  }

  findAll(): Promise<Maintenance[]> {
    return this.maintenanceModel.find().populate(['user', 'machine']).exec();
  }

  findOne(id: string) {
    return this.maintenanceModel.findById(id).populate(['user', 'machine']).exec();
  }

  async update(id: string, updateMaintenanceDto: UpdateMaintenanceDto) {
    const maintenance = await this.findOne(id);
    if (!maintenance) {
      return null;
    }
    Object.assign(maintenance, updateMaintenanceDto);
    return maintenance.save();
  }

  async remove(id: string) {
    const maintenance = await this.findOne(id);
    if (!maintenance) {
      return null;
    }
    return this.maintenanceModel.deleteOne({ _id: id });
  }
}
