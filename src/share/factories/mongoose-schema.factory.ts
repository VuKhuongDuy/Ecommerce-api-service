import { Type } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { SchemaFactory } from '@nestjs/mongoose';

export class MongooseSchemaFactory {
  static createForClass(target: Type<unknown>): mongoose.Schema<any> {
    return SchemaFactory.createForClass(target);
  }
}
