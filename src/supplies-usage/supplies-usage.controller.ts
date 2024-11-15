import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { SuppliesUsageService } from './supplies-usage.service';
import { CreateSuppliesUsageDto } from './dto/create-supplies-usage.dto';
import { UpdateSuppliesUsageDto } from './dto/update-supplies-usage.dto';
import { ParseObjectIdPipe } from 'src/pipes/parse-object-id-pipe.pipe';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('supplies-usage')
export class SuppliesUsageController {
  constructor(private readonly suppliesUsageService: SuppliesUsageService) {}

  @Post()
  create(@Body() createSuppliesUsageDtos: CreateSuppliesUsageDto[]) {
    return this.suppliesUsageService.create(createSuppliesUsageDtos);
  }

  @Get()
  findAll(@Query('filterDays') days?: string) {
    return this.suppliesUsageService.findAll(days);
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.suppliesUsageService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateSuppliesUsageDto: UpdateSuppliesUsageDto,
  ) {
    return this.suppliesUsageService.update(id, updateSuppliesUsageDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.suppliesUsageService.remove(id);
  }
}
