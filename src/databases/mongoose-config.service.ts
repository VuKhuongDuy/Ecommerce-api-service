import { Injectable } from '@nestjs/common';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
// import { ConfigService } from '@nestjs/config';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  createMongooseOptions(): MongooseModuleOptions {
    const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017';
    return {
      uri:
        process.env.CI_BUILD_NAME == `check:e2e-test`
          ? `mongodb://mongo/tracking`
          : mongoUrl,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // authSource:
      //   process.env.CI_BUILD_NAME == `check:e2e-test` ? 'tracking' : mongo.name,
      readPreference: 'secondaryPreferred',
    };
  }
}
