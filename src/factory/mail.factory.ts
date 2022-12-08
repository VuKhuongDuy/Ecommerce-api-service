import { MailerOptions, MailerOptionsFactory } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Injectable()
export class MailFactory implements MailerOptionsFactory {
  createMailerOptions(): Promise<MailerOptions> | MailerOptions {
    return {
      transport: {
        service: 'gmail',
        auth: {
          type: 'OAuth2',
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
    };
  }
}
