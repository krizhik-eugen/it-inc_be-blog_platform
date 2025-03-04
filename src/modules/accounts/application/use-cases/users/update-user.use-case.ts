import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersMongoRepository } from '../../../infrastructure';
import { UpdateUserDto } from '../../../dto/update';

export class UpdateUserCommand {
    constructor(
        public id: string,
        public dto: UpdateUserDto,
    ) {}
}

@CommandHandler(UpdateUserCommand)
export class UpdateUserUseCase
    implements ICommandHandler<UpdateUserCommand, void>
{
    constructor(private usersMongoRepository: UsersMongoRepository) {}

    async execute({ id, dto }: UpdateUserCommand): Promise<void> {
        const user = await this.usersMongoRepository.findByIdOrNotFoundFail(id);

        user.update(dto);

        await this.usersMongoRepository.save(user);
    }
}
