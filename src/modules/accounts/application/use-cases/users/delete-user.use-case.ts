import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../infrastructure';

export class DeleteUserCommand {
    constructor(public userId: number) {}
}
@CommandHandler(DeleteUserCommand)
export class DeleteUserUseCase
    implements ICommandHandler<DeleteUserCommand, void>
{
    constructor(private usersPostgresRepository: UsersRepository) {}

    async execute({ userId }: DeleteUserCommand): Promise<void> {
        await this.usersPostgresRepository.makeUserDeletedById(userId);
    }
}
