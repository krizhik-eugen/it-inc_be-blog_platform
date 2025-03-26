import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../infrastructure';
import { UpdateUserDto } from '../../../dto/update';

export class UpdateUserCommand {
    constructor(
        public id: number,
        public dto: UpdateUserDto,
    ) {}
}

@CommandHandler(UpdateUserCommand)
export class UpdateUserUseCase
    implements ICommandHandler<UpdateUserCommand, void>
{
    constructor(private usersRepository: UsersRepository) {}

    async execute({ id, dto }: UpdateUserCommand): Promise<void> {
        await this.usersRepository.updateUserEmail(id, dto.email);
    }
}
