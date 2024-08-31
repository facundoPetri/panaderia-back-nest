import { Module } from '@nestjs/common';
import { SuppliesUsageService } from './supplies-usage.service';
import { SuppliesUsageController } from './supplies-usage.controller';

@Module({
  controllers: [SuppliesUsageController],
  providers: [SuppliesUsageService],
})
export class SuppliesUsageModule {}
