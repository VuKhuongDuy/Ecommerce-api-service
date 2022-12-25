import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, SchemaTypes } from 'mongoose';

export type DiscountDocument = HydratedDocument<Discount>;

export class ProductDiscount {
  id: string;

  price: number;

  percent: number;
}

@Schema({ collection: 'discounts' })
export class Discount {
  @Prop({ alias: 'id', type: SchemaTypes.ObjectId })
  _id: ObjectId;

  @Prop()
  name: string;

  @Prop()
  voucher_code: string;

  @Prop()
  type: 'discount' | 'voucher';

  @Prop()
  start_time: Date;

  @Prop()
  end_time: Date;

  @Prop()
  default_value: number;

  @Prop()
  listproduct: [ProductDiscount];

  @Prop()
  create_at: Date;

  @Prop()
  update_at: Date;

  @Prop()
  delete_at: Date;
}
export const DiscountSchema = SchemaFactory.createForClass(Discount);

DiscountSchema.virtual('id').get(function () {
  return this._id;
});

// Ensure virtual fields are serialised.
DiscountSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});
