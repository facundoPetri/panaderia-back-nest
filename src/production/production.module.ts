import { Module } from '@nestjs/common';
import { ProductionService } from './production.service';
import { ProductionController } from './production.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Production, ProductionSchema } from './schemas/production.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Production.name,
        schema: ProductionSchema,
      },
    ]),
  ],
  controllers: [ProductionController],
  providers: [ProductionService],
})
export class ProductionModule {}
