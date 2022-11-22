import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema()
export class Category {
  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop()
  create_at: Date;
}
export const CategorySchema = SchemaFactory.createForClass(Category);
