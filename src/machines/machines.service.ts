import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMachineDto } from './dto/create-machine.dto';
import { UpdateMachineDto } from './dto/update-machine.dto';
import { Machine } from './schemas/machine.schema';

@Injectable()
export class MachinesService {
  constructor(
    @InjectModel(Machine.name) private machineModel: Model<Machine>,
  ) {}

  create(createMachineDto: CreateMachineDto) {
    const machine = new this.machineModel(createMachineDto);
    return machine.save();
  }

  findAll(): Promise<Machine[]> {
    return this.machineModel.find();
  }

  findOne(id: string) {
    return this.machineModel.findById(id);
  }

  async update(id: string, updateMachineDto: UpdateMachineDto) {
    const machine = await this.findOne(id);
    if (!machine) {
      return null;
    }
    Object.assign(machine, updateMachineDto);
    return machine.save();
  }

  async remove(id: string) {
    const machine = await this.findOne(id);
    if (!machine) {
      return null;
    }
    return this.machineModel.deleteOne({ _id: id });
  }
}
