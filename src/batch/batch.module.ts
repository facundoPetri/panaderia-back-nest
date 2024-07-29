import { Module } from '@nestjs/common';
import { BatchService } from './batch.service';
import { BatchController } from './batch.controller';
import { Batch, BatchSchema } from './schemas/batch.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { SuppliesModule } from 'src/supplies/supplies.module';

@Module({
  imports: [
    SuppliesModule,
    MongooseModule.forFeature([{ name: Batch.name, schema: BatchSchema }]),
  ],
  controllers: [BatchController],
  providers: [BatchService],
})
export class BatchModule {}
