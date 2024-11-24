import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WasteService } from './waste.service';
import { CreateWasteDto } from './dto/create-waste.dto';
import { UpdateWasteDto } from './dto/update-waste.dto';
import { ParseObjectIdPipe } from 'src/pipes/parse-object-id-pipe.pipe';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/schemas/user.schema';

@ApiBearerAuth()
@ApiTags('waste')
@Controller('waste')
export class WasteController {
  constructor(private readonly wasteService: WasteService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new waste record' })
  @ApiResponse({
    status: 201,
    description: 'Waste record created successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiBody({
    type: CreateWasteDto,
    description: 'Waste creation data',
  })
  create(@Body() createWasteDto: CreateWasteDto, @CurrentUser() user: User) {
    return this.wasteService.create(createWasteDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all waste records' })
  @ApiResponse({ status: 200, description: 'Returns all waste records.' })
  findAll() {
    return this.wasteService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get waste record by ID' })
  @ApiResponse({ status: 200, description: 'Returns the waste record.' })
  @ApiResponse({ status: 404, description: 'Waste record not found.' })
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.wasteService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update waste record by ID' })
  @ApiResponse({
    status: 200,
    description: 'Waste record updated successfully.',
  })
  @ApiResponse({ status: 404, description: 'Waste record not found.' })
  @ApiBody({
    type: UpdateWasteDto,
    description: 'Waste update data',
  })
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateWasteDto: UpdateWasteDto,
  ) {
    return this.wasteService.update(id, updateWasteDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete waste record by ID' })
  @ApiResponse({
    status: 200,
    description: 'Waste record deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'Waste record not found.' })
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.wasteService.remove(id);
  }
}
