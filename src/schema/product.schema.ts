import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, SchemaType, SchemaTypes } from 'mongoose';
import { Category } from './category.schema';
import { ProductDiscount } from './discount.schema';

export type ProductDocument = HydratedDocument<Product>;

class Filter {
  name: string;
  value: [string] | string;
}
export class Value {
  name: string;
  id: string;
}
export class Property {
  @Prop()
  name: string;

  @Prop()
  value: [string];
}

class Media {
  url: string;
  type: 'image' | 'video';
}

@Schema({ collection: 'products' })
export class Product {
  @Prop({ type: SchemaTypes.ObjectId, alias: 'id' })
  _id: ObjectId;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  title: string;

  @Prop()
  addinfo: string;

  @Prop({ type: SchemaTypes.Number })
  default_price: number;

  @Prop({ type: SchemaTypes.Number })
  selling_price: number;

  @Prop()
  sku: string;

  @Prop()
  slug: string;

  @Prop()
  sale_count: number;

  @Prop()
  quantity: number;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Category' })
  category: Category;

  @Prop()
  thumb_image: [Media];

  @Prop({ type: SchemaTypes.Boolean, default: false })
  new?: boolean;

  @Prop({ type: SchemaTypes.Boolean, default: false })
  featured?: boolean;

  @Prop({ type: SchemaTypes.Boolean, default: false })
  best_seller?: boolean;

  @Prop({ type: SchemaTypes.Boolean, default: false })
  carousel?: boolean;

  @Prop({ type: SchemaTypes.Boolean, default: false })
  stop_sell?: boolean;

  @Prop()
  discount?: ProductDiscount;

  @Prop()
  images: [Media];

  @Prop()
  properties: [Property];

  @Prop()
  filters: [Filter];
  /**
   * filter: {
      price: 20000,
      origin: ['us', 'ja']
      }
   */

  @Prop({ type: Date, required: true, default: Date.now })
  create_at: Date;

  @Prop({ type: Date, required: true, default: Date.now })
  update_at: Date;

  @Prop({ type: Date })
  delete_at: Date;
}
export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.virtual('id').get(function () {
  return this._id;
});

// Ensure virtual fields are serialised.
ProductSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});
