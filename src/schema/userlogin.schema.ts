import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, SchemaTypes } from 'mongoose';
import { User } from './user.schema';

export type UserLoginDocument = HydratedDocument<UserLogin>;

@Schema({ collection: 'user_login' })
export class UserLogin {
  @Prop({ type: SchemaTypes.ObjectId })
  id: ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: User.name })
  user?: User;

  @Prop({ type: SchemaTypes.String })
  email?: string;

  @Prop({ type: SchemaTypes.Date })
  expired?: Date;

  @Prop({ type: SchemaTypes.String })
  token?: string;

  @Prop({ alias: 'isDeleted', type: SchemaTypes.Boolean, default: false })
  is_deleted?: boolean;
  isDeleted?: boolean;
}

export const UserLoginSchema = SchemaFactory.createForClass(UserLogin);
