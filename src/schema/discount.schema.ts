import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Product } from './product.schema';

export type DiscountDocument = HydratedDocument<Discount>;

@Schema()
export class Discount {
  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop()
  start_time: Date;

  @Prop()
  end_time: Date;

  @Prop()
  default_value: string;

  @Prop()
  list_product: [string];

  @Prop()
  create_at: Date;

  @Prop()
  update_at: Date;

  @Prop()
  delete_at: Date;
}
export const DiscountSchema = SchemaFactory.createForClass(Discount);
