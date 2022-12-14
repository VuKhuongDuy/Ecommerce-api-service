import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import validationSchema from './configs/validation-schema';
import { MongooseConfigService } from './databases/mongoose-config.service';
import appConfig from './configs/app.config';
import { APP_FILTER, DiscoveryModule } from '@nestjs/core';
import { HttpErrorFilter } from './filters/http-error.filter';
import { MinioClientModule } from './minio-client/minio-client.module';
import { AuthModule } from './modules/auth/auth.module';
import { CategoryModule } from './modules/category/category.module';
import { OrderModule } from './modules/order/order.module';
import { ProductModule } from './modules/product/product.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      validationSchema: validationSchema,
    }),
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    MinioClientModule,
    AuthModule,
    AuthModule,
    CategoryModule,
    DiscoveryModule,
    OrderModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
  ],
})
export class AppModule {}
