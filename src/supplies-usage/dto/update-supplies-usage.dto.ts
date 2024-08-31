import { PartialType } from '@nestjs/mapped-types';
import { CreateSuppliesUsageDto } from './create-supplies-usage.dto';

export class UpdateSuppliesUsageDto extends PartialType(CreateSuppliesUsageDto) {}
