import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersPostgresRepository } from '../../../infrastructure';

export class DeleteUserCommand {
    constructor(public userId: number) {}
}
@CommandHandler(DeleteUserCommand)
export class DeleteUserUseCase
    implements ICommandHandler<DeleteUserCommand, void>
{
    constructor(
        // private usersMongoRepository: UsersMongoRepository,
        private usersPostgresRepository: UsersPostgresRepository,
    ) {}

    async execute({ userId }: DeleteUserCommand): Promise<void> {
        // const user =
        //     await this.usersMongoRepository.findByIdNonDeletedOrNotFoundFail(
        //         userId,
        //     );
        // user.makeDeleted();
        // await this.usersMongoRepository.save(user);

        await this.usersPostgresRepository.makeUserDeletedById(userId);
    }
}
