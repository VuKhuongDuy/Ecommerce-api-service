import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Product } from './product.schema';

export type OrderDocument = HydratedDocument<Order>;

@Schema()
export class Order {
  @Prop()
  id: string;

  @Prop()
  user_id: string | '';

  @Prop()
  listproduct: [Product];

  @Prop()
  state: string;

  @Prop()
  create_at: Date;
}
export const OrderSchema = SchemaFactory.createForClass(Order);
