import { EmailService } from '../../src/modules/notifications/email.service';

export class EmailServiceMock extends EmailService {
    async sendEmailConfirmationMessage(
        email: string,
        code: string,
    ): Promise<void> {
        console.log(
            'Call mock method sendConfirmationEmail / EmailServiceMock with `',
            email,
            code,
            '`',
        );

        return Promise.resolve();
    }
}
