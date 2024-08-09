import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import { Machine } from '../../machines/schemas/machine.schema';

export type MaintenanceDocument = HydratedDocument<Maintenance>;

@Schema()
export class Maintenance {
  @Prop()
  description: string;

  @Prop({ type: 'ObjectId', ref: 'User' })
  user: User;

  @Prop()
  date: Date;

  @Prop({ type: 'ObjectId', ref: 'Machine' })
  machine: Machine;
}

export const MaintenanceSchema = SchemaFactory.createForClass(Maintenance);
