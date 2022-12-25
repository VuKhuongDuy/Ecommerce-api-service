import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, SchemaTypes } from 'mongoose';

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
  category_id: string;

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

  @Prop()
  update_at: Date;

  @Prop({ type: Date })
  delete_at: Date;
}
export const ProductSchema = SchemaFactory.createForClass(Product);
