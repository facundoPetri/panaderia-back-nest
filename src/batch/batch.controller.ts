import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BatchService } from './batch.service';
import { CreateBatchDto } from './dto/create-batch.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';
import { ParseObjectIdPipe } from '../pipes/parse-object-id-pipe.pipe';
import { SuppliesService } from 'src/supplies/supplies.service';

@Controller('batch')
export class BatchController {
  constructor(
    private readonly batchService: BatchService,
    private readonly suppliesService: SuppliesService,
  ) {}

  @Post()
  async create(@Body() createBatchDto: CreateBatchDto) {
    const supply = await this.suppliesService.findOne(createBatchDto.supply_id);
    if (!supply) {
      throw new Error('insumo no encontrado');
    }
    const batch = await this.batchService.create(createBatchDto);
    await this.suppliesService.addBatch(supply, batch);
    return batch;
  }

  @Get()
  findAll() {
    return this.batchService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.batchService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateBatchDto: UpdateBatchDto,
  ) {
    return this.batchService.update(id, updateBatchDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.batchService.remove(id);
  }
}
