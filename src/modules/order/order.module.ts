import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthGuard } from 'src/guard/auth.guard';
// import { MailModule } from 'src/mail/mail.module';
import {
  Discount,
  DiscountSchema,
  Order,
  OrderSchema,
  Product,
  ProductSchema,
} from 'src/schema';
import { User, UserSchema } from 'src/schema/user.schema';
import { AuthController } from '../auth/auth.controller';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  providers: [OrderService, AuthGuard],
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Order.name, schema: OrderSchema },
      { name: Discount.name, schema: DiscountSchema },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    AuthModule,
    // MailModule,
  ],
  exports: [JwtModule, AuthGuard],
  controllers: [OrderController],
})
export class OrderModule {}
