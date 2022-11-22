import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationError, ValidationPipe } from '@nestjs/common';
import { ValidationException } from './share/exceptions/validation.exception';
// import { useContainer } from 'class-validator';
import { APP_CONFIG_NAME } from './configs/app.config';
import 'source-map-support/register';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      validationError: {
        target: false,
        value: false,
      },
      exceptionFactory: (errors: ValidationError[]) => {
        throw new ValidationException(errors);
      },
    }),
  );
  // app.setGlobalPrefix('api/v1')
  // , {
  // exclude: [{ path: 'health', method: RequestMethod.GET }],
  // });
  const configService = app.get(ConfigService);
  // mongoose.set('debug', configService.get(`${DATABASE_CONFIG_NAME}.mongo.debug`))
  await app.listen(configService.get(`${APP_CONFIG_NAME}.port`));
}
bootstrap();
