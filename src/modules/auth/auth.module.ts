import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthGuard } from 'src/guard/auth.guard';
import { User, UserSchema } from 'src/schema/user.schema';
import { UserLogin, UserLoginSchema } from 'src/schema/UserLogin.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  providers: [AuthService, AuthGuard],
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserLogin.name, schema: UserLoginSchema },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    forwardRef(() => AuthModule),
  ],
  exports: [AuthService, JwtModule, AuthGuard],
  controllers: [AuthController],
})
export class AuthModule {}
