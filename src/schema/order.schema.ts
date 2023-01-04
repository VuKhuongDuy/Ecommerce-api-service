import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, SchemaTypes } from 'mongoose';
import { Product } from './product.schema';

export type OrderDocument = HydratedDocument<Order>;

export class ProductOrder {
  @Prop()
  product: Product;

  @Prop()
  count: number;

  @Prop()
  property: string;
}
@Schema({ collection: 'orders' })
export class Order {
  @Prop({ alias: 'id', type: SchemaTypes.ObjectId })
  _id: ObjectId;

  @Prop({ alias: 'userOrder', type: SchemaTypes.String })
  user_order: string;

  @Prop({ type: SchemaTypes.String })
  user_note: string;

  @Prop({ type: ProductOrder })
  listproduct: ProductOrder[];

  @Prop()
  state: string;

  @Prop()
  voucher: string;

  @Prop()
  bill: number;

  @Prop({ alias: 'createAt', type: SchemaTypes.Date, default: Date.now })
  create_at: Date;

  @Prop({ alias: 'updateAt', type: SchemaTypes.Date, default: Date.now })
  update_at: Date;

  @Prop({ alias: 'deleteAt', type: SchemaTypes.Date })
  delete_at: Date;
}
export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.virtual('id').get(function () {
  return this._id;
});

// Ensure virtual fields are serialised.
OrderSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});
