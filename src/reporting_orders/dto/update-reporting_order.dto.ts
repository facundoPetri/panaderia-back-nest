import { PartialType } from '@nestjs/swagger';
import { CreateReportingOrderDto } from './create-reporting_order.dto';

export class UpdateReportingOrderDto extends PartialType(CreateReportingOrderDto) {}
