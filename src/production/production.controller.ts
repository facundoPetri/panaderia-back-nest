import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductionService } from './production.service';
import { CreateProductionDto } from './dto/create-production.dto';
import { UpdateProductionDto } from './dto/update-production.dto';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/schemas/user.schema';

@ApiBearerAuth()
@ApiTags('production')
@Controller('production')
export class ProductionController {
  constructor(private readonly productionService: ProductionService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new production record' })
  @ApiResponse({
    status: 201,
    description: 'Production record created successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  create(
    @Body() createProductionDto: CreateProductionDto,
    @CurrentUser() user: User,
  ) {
    return this.productionService.create(createProductionDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all production records' })
  @ApiResponse({ status: 200, description: 'Return all production records.' })
  findAll() {
    return this.productionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get production record by ID' })
  @ApiResponse({ status: 200, description: 'Return the production record.' })
  @ApiResponse({ status: 404, description: 'Production record not found.' })
  findOne(@Param('id') id: string) {
    return this.productionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update production record by ID' })
  @ApiResponse({
    status: 200,
    description: 'Production record updated successfully.',
  })
  @ApiResponse({ status: 404, description: 'Production record not found.' })
  update(
    @Param('id') id: string,
    @Body() updateProductionDto: UpdateProductionDto,
  ) {
    return this.productionService.update(id, updateProductionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete production record by ID' })
  @ApiResponse({
    status: 200,
    description: 'Production record deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'Production record not found.' })
  remove(@Param('id') id: string) {
    return this.productionService.remove(id);
  }
}
