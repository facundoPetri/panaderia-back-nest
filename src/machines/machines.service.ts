import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMachineDto } from './dto/create-machine.dto';
import { UpdateMachineDto } from './dto/update-machine.dto';
import { Machine, MachineDocument } from './schemas/machine.schema';
import { MaintenanceDocument } from 'src/maintenance/schemas/maintenance.schema';
import { getDaysDifference } from '../../helpers/utils';

@Injectable()
export class MachinesService {
  constructor(
    @InjectModel(Machine.name) private readonly machineModel: Model<Machine>,
  ) {}

  create(createMachineDto: CreateMachineDto) {
    const machine = new this.machineModel(createMachineDto);
    return machine.save();
  }

  async findAll(requireMaintenance?: string): Promise<Machine[]> {
    const machines = await this.machineModel.aggregate([
      {
        $lookup: {
          from: 'maintenances',
          localField: '_id',
          foreignField: 'machine',
          as: 'maintenance',
        },
      },
      {
        $unwind: {
          path: '$maintenance',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'maintenance.user',
          foreignField: '_id',
          as: 'maintenance.userDetails',
        },
      },
      {
        $unwind: {
          path: '$maintenance.userDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: '$_id',
          name: {
            $first: '$name',
          },
          description: {
            $first: '$description',
          },
          purcharse_date: {
            $first: '$purcharse_date',
          },
          desired_maintenance: {
            $first: '$desired_maintenance',
          },
          maintenance: {
            $push: '$maintenance',
          },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          purcharse_date: 1,
          desired_maintenance: 1,
          maintenance: {
            $sortArray: {
              input: '$maintenance',
              sortBy: {
                date: -1,
              },
            },
          },
        },
      },
    ]);

    machines.forEach((machine) => {
      const diff = getDaysDifference(
        new Date(machine.maintenance[0].date || machine.purcharse_date),
        new Date(),
      );
      machine.require_maintenance = diff > machine.desired_maintenance;
    });

    const isMaintenanceNeeded = requireMaintenance === 'true';

    return requireMaintenance
      ? machines.filter(
          (machine) => machine.require_maintenance === isMaintenanceNeeded,
        )
      : machines;
  }

  findOne(id: string) {
    return this.machineModel.findById(id).populate('maintenance').exec();
  }

  addMaintenance(machine: MachineDocument, maintenance: MaintenanceDocument) {
    machine.maintenance.push(maintenance);
    return machine.save();
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
