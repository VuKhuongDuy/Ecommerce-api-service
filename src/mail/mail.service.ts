import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import config from 'src/configs/configuration';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {
    this.addTransporterMail();
  }

  async sendMail(content, email) {
    try {
      await this.send(content, email);
    } catch (e) {
      console.log({ e });
      await this.addTransporterMail();
      await this.send(content, email);
    }
  }

  async send(content, email) {
    if (!email) {
      email = process.env.MAIL_ADMIN;
    }
    await this.mailerService.sendMail({
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
    const myOAuth2Client = new OAuth2Client(mail.clientId, mail.clientSecret);
    myOAuth2Client.setCredentials({
      refresh_token: mail.refreshToken,
    });
    const myAccessTokenObject = await myOAuth2Client.getAccessToken();
    const myAccessToken = myAccessTokenObject?.token;

    this.mailerService.addTransporter('MAIL_ECOMMERCE', {
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: mail.user,
        pass: mail.pass,
        clientId: mail.clientId,
        clientSecret: mail.clientSecret,
        refresh_token: mail.refreshToken,
        accessUrl: 'https://oauth2.googleapis.com/token',
        accessToken: myAccessToken,
      },
    });
  }
}
