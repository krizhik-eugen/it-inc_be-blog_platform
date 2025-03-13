import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { CoreConfig } from '../../core/config';
import { EMAIL_SERVICE } from './constants';
import { EmailService } from './email.service';
import {
    SendConfirmationEmailEventHandler,
    SendPasswordRecoveryEmailEventHandler,
} from './event-handlers';

@Module({
    imports: [
        MailerModule.forRootAsync({
            useFactory: (coreConfig: CoreConfig) => ({
                transport: {
                    service: EMAIL_SERVICE,
                    auth: {
                        user: coreConfig.hostEmailLogin,
                        pass: coreConfig.hostEmailPassword,
                    },
                },
                defaults: {
                    from: `MongoBlog Platform <${coreConfig.hostEmailLogin}>`,
                },
            }),
            inject: [CoreConfig],
        }),
    ],
    providers: [
        EmailService,
        SendConfirmationEmailEventHandler,
        SendPasswordRecoveryEmailEventHandler,
    ],
    exports: [EmailService],
})
export class NotificationsModule {}
