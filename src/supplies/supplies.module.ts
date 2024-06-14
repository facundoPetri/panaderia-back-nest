import { Module } from '@nestjs/common';
import { SuppliesService } from './supplies.service';
import { SuppliesController } from './supplies.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Supply, SupplySchema } from './schemas/supply.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Supply.name, schema: SupplySchema }]),
  ],
  controllers: [SuppliesController],
  providers: [SuppliesService],
})
export class SuppliesModule {}
