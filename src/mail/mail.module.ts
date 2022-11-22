import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import config from '../configs/configuration';

const { mail } = config;
@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: mail.host,
        port: mail.port,
        secure: mail.secure,
        auth: {
          user: mail.user,
          pass: mail.pass,
        },
      },
      defaults: {
        from: `"Zinza Tracking" <${mail.user}>`,
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
