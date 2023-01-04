import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthGuard } from 'src/guard/auth.guard';
import { User, UserSchema, Post, PostSchema } from 'src/schema';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  providers: [PostService, AuthGuard],
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Post.name, schema: PostSchema },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    AuthModule,
  ],
  exports: [JwtModule, AuthGuard],
  controllers: [PostController],
})
export class PostModule {}
