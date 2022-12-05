import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, SchemaTypes } from 'mongoose';
import { Product } from './product.schema';

export type PostDocument = HydratedDocument<Post>;

@Schema({ collection: 'posts' })
export class Post {
  @Prop({ alias: 'id', type: SchemaTypes.ObjectId })
  _id: ObjectId;

  @Prop()
  title: string;

  @Prop()
  content: [Product];

  @Prop()
  create_at: Date;
}
export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.virtual('id').get(function () {
  return this._id;
});

// Ensure virtual fields are serialised.
PostSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});
