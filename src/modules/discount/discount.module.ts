import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthGuard } from 'src/guard/auth.guard';
import { Discount, DiscountSchema } from 'src/schema';
import { Product, ProductSchema } from 'src/schema/product.schema';
import { User, UserSchema } from 'src/schema/user.schema';
import { AuthController } from '../auth/auth.controller';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { DiscountController } from './discount.controller';
import { DiscountService } from './discount.service';

@Module({
  providers: [DiscountService, AuthGuard],
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Discount.name, schema: DiscountSchema },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    AuthModule,
  ],
  exports: [JwtModule, AuthGuard],
  controllers: [DiscountController],
})
export class DiscountModule {}
