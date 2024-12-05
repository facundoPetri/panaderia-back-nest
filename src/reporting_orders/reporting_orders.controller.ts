import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ReportingOrdersService } from './reporting_orders.service';
import { CreateReportingOrderDto } from './dto/create-reporting_order.dto';
import { UpdateReportingOrderDto } from './dto/update-reporting_order.dto';
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
@ApiTags('reporting-orders')
@Controller('reporting-orders')
export class ReportingOrdersController {
  constructor(
    private readonly reportingOrdersService: ReportingOrdersService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new reporting order' })
  @ApiResponse({
    status: 201,
    description: 'The reporting order has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({ type: CreateReportingOrderDto })
  create(
    @Body() createReportingOrderDto: CreateReportingOrderDto,
    @CurrentUser() user: User,
  ) {
    return this.reportingOrdersService.create(createReportingOrderDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all reporting orders' })
  @ApiResponse({ status: 200, description: 'Return all reporting orders.' })
  findAll() {
    return this.reportingOrdersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a reporting order by ID' })
  @ApiResponse({ status: 200, description: 'Return the reporting order.' })
  @ApiResponse({ status: 404, description: 'Reporting order not found.' })
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.reportingOrdersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a reporting order' })
  @ApiResponse({
    status: 200,
    description: 'The reporting order has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Reporting order not found.' })
  @ApiBody({ type: UpdateReportingOrderDto })
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateReportingOrderDto: UpdateReportingOrderDto,
  ) {
    return this.reportingOrdersService.update(id, updateReportingOrderDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a reporting order' })
  @ApiResponse({
    status: 200,
    description: 'The reporting order has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Reporting order not found.' })
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.reportingOrdersService.remove(id);
  }
}
