import { Injectable } from '@nestjs/common';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { APP_CONFIG_NAME } from '../configs/app.config';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  constructor(private configService: ConfigService) {}

  createMongooseOptions(): MongooseModuleOptions {
    const { mongo } = this.configService.get(`${APP_CONFIG_NAME}`);
    return {
      uri:
        process.env.CI_BUILD_NAME == `check:e2e-test`
          ? `mongodb://mongo/tracking`
          : `mongodb://${mongo.host}/${mongo.name}`,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      user: mongo.user,
      pass: mongo.pass,
      authSource:
        process.env.CI_BUILD_NAME == `check:e2e-test` ? 'tracking' : mongo.name,
      readPreference: 'secondaryPreferred',
    };
  }
}
