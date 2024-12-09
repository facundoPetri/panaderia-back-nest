import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { SupplyDocument } from 'src/supplies/schemas/supply.schema';

export type BatchDocument = HydratedDocument<Batch>;

@Schema()
export class Batch {
  @Prop()
  expiration_date: Date;

  @Prop()
  date_of_entry: Date;

  @Prop()
  quantity: number;

  @Prop({ unique: true, default: 1 })
  batch_number: number;

  @Prop()
  row: number;

  @Prop()
  column: number;

  @Prop({ type: 'ObjectId', ref: 'Supply' })
  supply_id: SupplyDocument;
}

export const BatchSchema = SchemaFactory.createForClass(Batch);

BatchSchema.statics.getNextBatchNumber = async function () {
  const lastBatch = await this.findOne().sort('-batch_number');
  return lastBatch ? lastBatch.batch_number + 1 : 1;
};

BatchSchema.pre('save', async function (next) {
  if (this.isNew) {
    const doc = this as BatchDocument;
    if (!doc.batch_number || doc.batch_number === 1) {
      doc.batch_number = await (this.constructor as any).getNextBatchNumber();
    }
  }
  next();
});
