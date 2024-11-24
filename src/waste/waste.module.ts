import { Module } from '@nestjs/common';
import { WasteService } from './waste.service';
import { WasteController } from './waste.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Waste, WasteSchema } from './schemas/waste.schema';
import { BatchModule } from 'src/batch/batch.module';
import { SuppliesModule } from 'src/supplies/supplies.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Waste.name, schema: WasteSchema }]),
    BatchModule,
    SuppliesModule,
  ],
  controllers: [WasteController],
  providers: [WasteService],
})
export class WasteModule {}
