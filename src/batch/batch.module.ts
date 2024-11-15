import { Module } from '@nestjs/common';
import { BatchService } from './batch.service';
import { BatchController } from './batch.controller';
import { Batch, BatchSchema } from './schemas/batch.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { SuppliesModule } from 'src/supplies/supplies.module';
import { PdfService } from 'src/pdf/pdf.service';

@Module({
  imports: [
    SuppliesModule,
    MongooseModule.forFeature([{ name: Batch.name, schema: BatchSchema }]),
  ],
  controllers: [BatchController],
  providers: [BatchService, PdfService],
  exports: [BatchService],
})
export class BatchModule {}
