import { MailerOptions, MailerOptionsFactory } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import config from 'src/configs/configuration';

@Injectable()
export class MailFactory implements MailerOptionsFactory {
  createMailerOptions(): Promise<MailerOptions> | MailerOptions {
    const { mail } = config;
    return {
      transport: {
        name: 'MAIL_ECOMMERCE',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: mail.user,
          pass: mail.pass,
        },
      },
      options: {
        name: 'MAIL_ECOMMERCE',
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
    };
  }
}
