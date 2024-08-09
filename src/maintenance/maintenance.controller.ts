import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';
import { ParseObjectIdPipe } from '../pipes/parse-object-id-pipe.pipe';
import { MachinesService } from '../machines/machines.service';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/schemas/user.schema';

@Controller('maintenance')
export class MaintenanceController {
  constructor(
    private readonly maintenanceService: MaintenanceService,
    private readonly machineService: MachinesService,
  ) {}

  @Post()
  async create(@Body() createMaintenanceDto: CreateMaintenanceDto, @CurrentUser() user: User) {
    const machine = await this.machineService.findOne(createMaintenanceDto.machine);
    if (!machine) {
      throw new NotFoundException('Machine not found');
    }
    const maintenance = await this.maintenanceService.create(createMaintenanceDto, user);
    await this.machineService.addMaintenance(machine, maintenance);
    return maintenance;
  }

  @Get()
  findAll() {
    return this.maintenanceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.maintenanceService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateMaintenanceDto: UpdateMaintenanceDto,
  ) {
    return this.maintenanceService.update(id, updateMaintenanceDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.maintenanceService.remove(id);
  }
}
