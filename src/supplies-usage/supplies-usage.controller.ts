import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SuppliesUsageService } from './supplies-usage.service';
import { CreateSuppliesUsageDto } from './dto/create-supplies-usage.dto';
import { UpdateSuppliesUsageDto } from './dto/update-supplies-usage.dto';
import { ParseObjectIdPipe } from 'src/pipes/parse-object-id-pipe.pipe';

@Controller('supplies-usage')
export class SuppliesUsageController {
  constructor(private readonly suppliesUsageService: SuppliesUsageService) {}

  @Post()
  create(@Body() createSuppliesUsageDto: CreateSuppliesUsageDto) {
    return this.suppliesUsageService.create(createSuppliesUsageDto);
  }

  @Get()
  findAll() {
    return this.suppliesUsageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.suppliesUsageService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseObjectIdPipe) id: string, @Body() updateSuppliesUsageDto: UpdateSuppliesUsageDto) {
    return this.suppliesUsageService.update(id, updateSuppliesUsageDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.suppliesUsageService.remove(id);
  }
}
