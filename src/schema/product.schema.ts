import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { string } from 'joi';
import { HydratedDocument } from 'mongoose';
import { Property } from './category.schema';

export type ProductDocument = HydratedDocument<Product>;

class Media {
  url: string;
  type: 'image' | 'video';
}

@Schema()
export class Product {
  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  price: string;

  @Prop()
  default_price: [string];

  @Prop()
  selling_price: string;

  @Prop()
  images: [Media];

  @Prop()
  Properties: [Property];

  @Prop()
  create_at: Date;

  @Prop()
  update_at: Date;

  @Prop()
  delete_at: Date;
}
export const ProductSchema = SchemaFactory.createForClass(Product);
