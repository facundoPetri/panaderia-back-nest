import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { MaintenanceDocument } from 'src/maintenance/schemas/maintenance.schema';

export type MachineDocument = HydratedDocument<Machine>;

@Schema()
export class Machine {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  purcharse_date: Date;

  @Prop()
  desired_maintenance: number;

  @Prop([{ type: 'ObjectId', ref: 'Maintenance' }])
  maintenance: MaintenanceDocument[];

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const MachineSchema = SchemaFactory.createForClass(Machine);
