import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailFactory } from 'src/factory/mail.factory';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useClass: MailFactory,
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
