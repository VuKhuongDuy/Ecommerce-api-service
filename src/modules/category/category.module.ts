import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthGuard } from 'src/guard/auth.guard';
import { Category, CategorySchema } from 'src/schema/category.schema';
import { AuthService } from '../auth/auth.service';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

@Module({
  providers: [CategoryService, AuthGuard],
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  exports: [AuthService, JwtModule, AuthGuard],
  controllers: [CategoryController],
})
export class CategoryModule {}
