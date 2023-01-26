import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import Handlebars from 'handlebars';
import { APP_CONFIG_NAME } from 'src/configs/app.config';
import config from 'src/configs/configuration';
@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {
    this.addTransporterMail();
  }

  async getContentCreate(params) {
    const html = await fs.readFileSync('src/mail/templates/new-order.html', {
      encoding: 'utf8',
    });

    const template = Handlebars.compile(html);
    return template(params);
  }

  async sendMail(content, email) {
    try {
      await this.send(content, email);
    } catch (e) {
      console.log({ e });
      await this.send(content, email);
    }
  }

  async send(content, email) {
    if (!email) {
      email = process.env.MAIL_ADMIN;
    }
    const mailAdmin = this.configService.get(`${APP_CONFIG_NAME}`);
    await this.mailerService.sendMail({
      from: mailAdmin,
      to: email,
      subject: 'New order',
      template: './active',
      html: content,
      transporterName: 'MAIL_ECOMMERCE',
      // attachments: [
      //   {
      //     filename: 'logo.svg',
      //     path: __dirname + '/templates/logo.svg',
      //     cid: 'logo',
      //   },
      // ],
      // context: {
      //   email,
      //   urlFe: config.urlFe,
      // },
    });
  }

  async addTransporterMail() {
    const { mail } = config;

    this.mailerService.addTransporter('MAIL_ECOMMERCE', {
      service: 'gmail',
      auth: {
        user: mail.user,
        pass: mail.pass,
      },
    });
  }
}
