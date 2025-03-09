import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AccountsConfig } from '../../../config';
import { CryptoService } from '../../crypto.service';
import { UsersPostgresRepository } from '../../../infrastructure';
import { CreateUserDto } from '../../../dto/create';

export class CreateUserCommand {
    constructor(public dto: CreateUserDto) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase
    implements ICommandHandler<CreateUserCommand, number>
{
    constructor(
        // @InjectModel(MongoUser.name)
        // private MongoUserModel: MongoUserModelType,
        // private usersMongoRepository: UsersMongoRepository,
        private usersPostgresRepository: UsersPostgresRepository,
        private accountsConfig: AccountsConfig,
        private cryptoService: CryptoService,
    ) {}

    async execute({ dto }: CreateUserCommand): Promise<number> {
        const passwordHash = await this.cryptoService.createPasswordHash(
            dto.password,
        );

        const newUserId = await this.usersPostgresRepository.addNewUser({
            login: dto.login,
            email: dto.email,
            passwordHash,
        });

        // const newUser = this.MongoUserModel.createInstance({
        //     email: dto.email,
        //     login: dto.login,
        //     passwordHash,
        // });

        if (this.accountsConfig.isUserAutomaticallyConfirmed) {
            //     newUser.emailConfirmation.isConfirmed = true;
            await this.usersPostgresRepository.updateUserIsConfirmed(
                newUserId,
                true,
            );
        }

        // await this.usersMongoRepository.save(newUser);

        return newUserId;
    }
}
