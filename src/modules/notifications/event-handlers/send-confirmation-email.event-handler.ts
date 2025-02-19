import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EmailService } from '../email.service';
import { UserRegisteredEvent } from '../../accounts/domain/events';

// https://docs.nestjs.com/recipes/cqrs#events
@EventsHandler(UserRegisteredEvent)
export class SendConfirmationEmailEventHandler
    implements IEventHandler<UserRegisteredEvent>
{
    constructor(private emailService: EmailService) {}

    async handle(event: UserRegisteredEvent) {
        // Errors in EventHandlers cannot be caught by exception filters: must be handled manually

        await this.emailService.sendEmailConfirmationMessage(
            event.email,
            event.confirmationCode,
        );
    }
}
