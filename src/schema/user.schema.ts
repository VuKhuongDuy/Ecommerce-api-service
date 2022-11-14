import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  id: string;

  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop()
  role: string;

  @Prop()
  address: [string];

  @Prop()
  phone: string;

  @Prop()
  birthday: string;

  @Prop()
  sex: string;

  @Prop()
  email: string;

  @Prop()
  create_at: Date;

  @Prop()
  update_at: Date;

  @Prop()
  delete_at: Date;
}
export const UserSchema = SchemaFactory.createForClass(User);
