import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthGuard } from 'src/guard/auth.guard';
import { Banner, BannerSchema } from 'src/schema/banner.schema';
import { AuthModule } from '../auth/auth.module';
import { BannerController } from './banner.controller';
import { BannerService } from './banner.service';

@Module({
  providers: [BannerService, AuthGuard],
  imports: [
    MongooseModule.forFeature([{ name: Banner.name, schema: BannerSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    AuthModule,
  ],
  exports: [JwtModule, AuthGuard],
  controllers: [BannerController],
})
export class BannerModule {}
