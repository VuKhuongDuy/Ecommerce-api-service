import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, SchemaTypes } from 'mongoose';
import { Product } from './product.schema';

export type CartDocument = HydratedDocument<Cart>;

@Schema({ collection: 'carts' })
export class Cart {
  @Prop({ alias: 'id', type: SchemaTypes.ObjectId })
  _id: ObjectId;

  @Prop()
  user_id: string | '';

  @Prop()
  listproduct: [Product];

  @Prop()
  state: string;

  @Prop({ type: Date, required: true, default: Date.now })
  create_at: Date;
}
export const CartSchema = SchemaFactory.createForClass(Cart);

CartSchema.virtual('id').get(function () {
  return this._id;
});

// Ensure virtual fields are serialised.
CartSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});
