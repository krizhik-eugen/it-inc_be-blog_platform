import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersMongoRepository } from '../../../infrastructure';

export class DeleteUserCommand {
    constructor(public userId: string) {}
}
@CommandHandler(DeleteUserCommand)
export class DeleteUserUseCase
    implements ICommandHandler<DeleteUserCommand, void>
{
    constructor(private usersMongoRepository: UsersMongoRepository) {}

    async execute({ userId }: DeleteUserCommand): Promise<void> {
        const user =
            await this.usersMongoRepository.findByIdNonDeletedOrNotFoundFail(userId);

        user.makeDeleted();

        await this.usersMongoRepository.save(user);
    }
}
