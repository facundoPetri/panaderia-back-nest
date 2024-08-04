import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

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
  last_maintenance_date: string;

  @Prop()
  desired_maintenance: number;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const MachineSchema = SchemaFactory.createForClass(Machine);
