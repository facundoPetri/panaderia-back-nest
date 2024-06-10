import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  fullname: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  type: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  lastSession: Date;

  @Prop({ default: true })
  state: boolean;

  @Prop()
  image: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
