import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import { Machine } from '../../machines/schemas/machine.schema';

export type MaintenanceDocument = HydratedDocument<Maintenance>;

@Schema()
export class Maintenance {
  @Prop({ unique: true })
  number: number;

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

MaintenanceSchema.statics.getNextOrderNumber = async function () {
  const lastMaintenance = await this.findOne().sort('-number');
  return lastMaintenance ? lastMaintenance.number + 1 : 1;
};

MaintenanceSchema.pre('save', async function (next) {
  if (this.isNew) {
    const doc = this as MaintenanceDocument;
    doc.number = await (this.constructor as any).getNextOrderNumber();
  }
  next();
});
