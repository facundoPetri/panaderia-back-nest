import { Module } from '@nestjs/common';
import { SuppliesUsageService } from './supplies-usage.service';
import { SuppliesUsageController } from './supplies-usage.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SuppliesUsage,
  SuppliesUsageSchema,
} from './schemas/supplies-usage.schema';
import { BatchModule } from 'src/batch/batch.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SuppliesUsage.name, schema: SuppliesUsageSchema },
    ]),
    BatchModule,
  ],
  controllers: [SuppliesUsageController],
  providers: [SuppliesUsageService],
})
export class SuppliesUsageModule {}
