import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import {
    getEmailConfirmationTemplate,
    getPasswordRecoveryTemplate,
} from '../../helpers';

@Injectable()
export class EmailService {
    constructor(private mailerService: MailerService) {}

    private async sendEmail(
        email: string,
        subject: string,
        html: string,
    ): Promise<void> {
        this.mailerService
            .sendMail({
                subject,
                to: email,
                html,
            })
            .catch(() => {
                throw new Error('Error sending email');
            });
        // Added Promise.resolve() to return a resolved promise and not wait for the email to be sent
        return Promise.resolve();
    }

    async sendEmailConfirmationMessage(
        email: string,
        confirmationCode: string,
    ): Promise<void> {
        const htmlTemplate = getEmailConfirmationTemplate(confirmationCode);
        const subject = 'Confirm your registration email';
        await this.sendEmail(email, subject, htmlTemplate);
        return Promise.resolve();
    }

    async sendEmailPasswordRecoveryMessage(
        email: string,
        confirmationCode: string,
    ): Promise<void> {
        const htmlTemplate = getPasswordRecoveryTemplate(confirmationCode);
        const subject = 'Confirm your password recovery email';
        await this.sendEmail(email, subject, htmlTemplate);
        return Promise.resolve();
    }
}
