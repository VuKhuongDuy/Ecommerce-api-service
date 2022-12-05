import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import config from '../configs/configuration';

const { mail } = config;
console.log({mail})
@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        name: 'MAIL_ECOMMERCE',
        // host: mail.host,
        // port: mail.port,
        // secure: mail.secure,
        auth: {
          type: 'OAuth2',
          user: 'vukhuongduy2305@gmail.com',
          pass: 'Manunited23-',
          clientId: mail.clientId,
          clientSecret: mail.clientSecret,
          refresh_token: mail.refreshToken,
          accessUrl: 'https://oauth2.googleapis.com/token',
          accessToken: accesskey,
        },
      },
      defaults: {
        from: `"Ecommerce"`,
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
