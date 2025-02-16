import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EmailService } from '../email.service';
import { UserPasswordRecoveryEvent } from '../../accounts/domain/events/user-password-recovery.event';

// https://docs.nestjs.com/recipes/cqrs#events
@EventsHandler(UserPasswordRecoveryEvent)
export class SendPasswordRecoveryEmailEventHandler
    implements IEventHandler<UserPasswordRecoveryEvent>
{
    constructor(private emailService: EmailService) {}

    async handle(event: UserPasswordRecoveryEvent) {
        // Errors in EventHandlers cannot be caught by exception filters: must be handled manually

        await this.emailService.sendEmailPasswordRecoveryMessage(
            event.email,
            event.confirmationCode,
        );
    }
}
