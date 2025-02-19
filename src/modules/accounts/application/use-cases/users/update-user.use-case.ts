import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../infrastructure';
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
    constructor(private usersRepository: UsersRepository) {}

    async execute({ id, dto }: UpdateUserCommand): Promise<void> {
        const user = await this.usersRepository.findByIdOrNotFoundFail(id);

        user.update(dto);

        await this.usersRepository.save(user);
    }
}
