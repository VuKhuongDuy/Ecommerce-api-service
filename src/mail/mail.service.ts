import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import config from 'src/configs/configuration';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {
    const { mail } = config;
    this.configMailService();
  }

  async sendMailUser(email: string, content) {
    const result = await this.mailerService.sendMail({
      to: email,
      subject: 'New order',
      // template: './active',
      // attachments: [
      //   {
      //     filename: 'logo.svg',
      //     path: __dirname + '/templates/logo.svg',
      //     cid: 'logo',
      //   },
      // ],
      html: content,
    });
    console.log({ result });
  }

  async sendMailAdmin(content) {
    const email = process.env.MAIL_ADMIN;
    const result = await this.mailerService.sendMail({
      to: email,
      subject: 'New order',
      template: './active',
      html: content,
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

    console.log(result);
  }

  async configMailService() {
    const { mail } = config;
    const myOAuth2Client = new OAuth2Client(mail.clientId, mail.clientSecret);
    // Set Refresh Token vào OAuth2Client Credentials
    myOAuth2Client.setCredentials({
      refresh_token: mail.refreshToken,
    });
    const myAccessTokenObject = await myOAuth2Client.getAccessToken();
    // Access Token sẽ nằm trong property 'token' trong Object mà chúng ta vừa get được ở trên
    const myAccessToken = myAccessTokenObject?.token;
    console.log({myAccessToken})
    this.mailerService.addTransporter('MAIL_ECOMMERCE', {
      auth: {
        access_token: myAccessToken,
      },
    });
  }
}
