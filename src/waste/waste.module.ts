import { Module } from '@nestjs/common';
import { WasteService } from './waste.service';
import { WasteController } from './waste.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Waste, WasteSchema } from './schemas/waste.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Waste.name, schema: WasteSchema }]),
  ],
  controllers: [WasteController],
  providers: [WasteService],
})
export class WasteModule {}
