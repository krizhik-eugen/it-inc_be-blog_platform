import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EMAIL_SERVICE } from '../../constants';
import { EmailService } from './email.service';

@Module({
    imports: [
        MailerModule.forRootAsync({
            useFactory: () => ({
                transport: {
                    service: EMAIL_SERVICE,
                    auth: {
                        user: process.env.HOST_EMAIL_LOGIN,
                        pass: process.env.HOST_EMAIL_PASSWORD,
                    },
                },
                defaults: {
                    from: `Blog Platform <${process.env.HOST_EMAIL_LOGIN}>`,
                },
            }),
        }),
    ],
    providers: [EmailService],
    exports: [EmailService],
})
export class NotificationsModule {}
