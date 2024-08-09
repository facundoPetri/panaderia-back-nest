import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MachinesService } from './machines.service';
import { MachinesController } from './machines.controller';
import { Machine, MachineSchema } from './schemas/machine.schema';
import { PdfService } from '../pdf/pdf.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Machine.name, schema: MachineSchema }]),
  ],
  controllers: [MachinesController],
  providers: [MachinesService, PdfService],
  exports: [MachinesService],
})
export class MachinesModule {}
