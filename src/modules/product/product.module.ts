import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthGuard } from 'src/guard/auth.guard';
import { MinioClientModule } from 'src/minio-client/minio-client.module';
import {
  Category,
  CategorySchema,
  Product,
  ProductSchema,
  User,
  UserSchema,
} from 'src/schema';
import { AuthController } from '../auth/auth.controller';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  providers: [ProductService, AuthGuard],
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    AuthModule,
    MinioClientModule,
  ],
  exports: [JwtModule, AuthGuard],
  controllers: [ProductController],
})
export class ProductModule {}
