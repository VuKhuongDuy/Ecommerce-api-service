import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

export class Property {
  @Prop()
  name: string;

  @Prop()
  value: [string];
}

@Schema()
export class Category {
  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop()
  properties: [Property];

  @Prop()
  create_at: Date;
}
export const CategorySchema = SchemaFactory.createForClass(Category);
