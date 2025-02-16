import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { CoreConfig } from '../../core/config';
import { EMAIL_SERVICE } from './constants';
import { EmailService } from './email.service';
import { SendConfirmationEmailEventHandler } from './event-handlers/send-confirmation-email.event-handler';
import { SendPasswordRecoveryEmailEventHandler } from './event-handlers/send-password-recovery-email.event-handler';

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
                    from: `Blog Platform <${coreConfig.hostEmailLogin}>`,
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
