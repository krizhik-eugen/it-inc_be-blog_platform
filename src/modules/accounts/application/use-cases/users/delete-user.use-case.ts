import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../infrastructure';

export class DeleteUserCommand {
    constructor(public userId: string) {}
}
@CommandHandler(DeleteUserCommand)
export class DeleteUserUseCase
    implements ICommandHandler<DeleteUserCommand, void>
{
    constructor(private usersRepository: UsersRepository) {}

    async execute({ userId }: DeleteUserCommand): Promise<void> {
        const user =
            await this.usersRepository.findByIdNonDeletedOrNotFoundFail(userId);

        user.makeDeleted();

        await this.usersRepository.save(user);
    }
}
