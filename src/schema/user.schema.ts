import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, SchemaTypes } from 'mongoose';
import * as mongoose from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ collection: 'users' })
export class User {
  _id: mongoose.Types.ObjectId;

  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop()
  role: 'admin' | 'user';

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

  @Prop({ type: Date, required: true, default: Date.now })
  create_at: Date;

  @Prop({ type: Date, required: true, default: Date.now })
  update_at: Date;

  @Prop({ type: Date })
  delete_at: Date;
}
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('id').get(function () {
  return this._id;
});

// Ensure virtual fields are serialised.
UserSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});
