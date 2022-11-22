import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { Product } from './product.schema';

export type OrderDocument = HydratedDocument<Order>;

@Schema()
export class Order {
  @Prop()
  id: string;

  @Prop({ alias: 'userOrder', type: SchemaTypes.String })
  user_order: string;

  @Prop()
  listproduct: [Product];

  @Prop()
  state: string;

  @Prop()
  voucher: string;

  @Prop({ alias: 'createAt', type: SchemaTypes.Date })
  create_at: Date;

  @Prop({ alias: 'updateAt', type: SchemaTypes.Date })
  update_at: Date;

  @Prop({ alias: 'deleteAt', type: SchemaTypes.Date })
  delete_at: Date;
}
export const OrderSchema = SchemaFactory.createForClass(Order);
