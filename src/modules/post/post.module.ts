import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthGuard } from 'src/guard/auth.guard';
import { Product, ProductSchema } from 'src/schema/product.schema';
import { User, UserSchema } from 'src/schema/user.schema';
import { AuthController } from '../auth/auth.controller';
import { AuthService } from '../auth/auth.service';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  providers: [PostService, AuthGuard],
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  exports: [AuthService, JwtModule, AuthGuard],
  controllers: [PostController],
})
export class PostModule {}
