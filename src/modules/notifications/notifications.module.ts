import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from './email.service';
import { EMAIL_SERVICE } from './constants';
import { CoreConfig } from '../../core/config/core.config';

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
    providers: [EmailService],
    exports: [EmailService],
})
export class NotificationsModule {}
