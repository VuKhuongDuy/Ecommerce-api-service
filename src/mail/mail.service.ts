import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import config from '../configs/configuration'

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendMailActive(email: string, password = '') {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Active account now !',
      template: './active',
      attachments: [
        {
          filename: 'logo.svg',
          path: __dirname + '/templates/logo.svg',
          cid: 'logo',
        },
      ],
      context: {
        email,
        password,
        urlFe: config.urlFe,
      },
    })
  }
}
