import { ApiProperty } from '@nestjs/swagger';
import { PaginatedViewDto } from '../../../../../core/dto';
import { PostgresUser } from '../../../domain/user.postgres-entity';

// export class MongoUserViewDto {
//     @ApiProperty()
//     id: string;
//     @ApiProperty()
//     login: string;
//     @ApiProperty()
//     email: string;
//     @ApiProperty()
//     createdAt: string;

//     static mapToView(user: MongoUserDocument): MongoUserViewDto {
//         const dto = new MongoUserViewDto();

//         dto.id = user._id.toString();
//         dto.login = user.login;
//         dto.email = user.email;
//         dto.createdAt = user.createdAt;

//         return dto;
//     }
// }

// export class PaginatedMongoUsersViewDto extends PaginatedViewDto<
//     MongoUserViewDto[]
// > {
//     @ApiProperty({
//         type: [MongoUserViewDto],
//     })
//     items: MongoUserViewDto[];
// }

// export class MongoMeViewDto {
//     @ApiProperty()
//     userId: string;
//     @ApiProperty()
//     login: string;
//     @ApiProperty()
//     email: string;

//     static mapToView(user: MongoUserDocument): MongoMeViewDto {
//         const dto = new MongoMeViewDto();

//         dto.userId = user._id.toString();
//         dto.login = user.login;
//         dto.email = user.email;

//         return dto;
//     }
// }

export class PostgresUserViewDto {
    @ApiProperty()
    userId: string;
    @ApiProperty()
    login: string;
    @ApiProperty()
    email: string;

    static mapToView(user: PostgresUser): PostgresUserViewDto {
        const dto = new PostgresUserViewDto();

        dto.userId = user.id.toString();
        dto.login = user.login;
        dto.email = user.email;

        return dto;
    }
}

export class PaginatedPostgresUsersViewDto extends PaginatedViewDto<
    PostgresUserViewDto[]
> {
    @ApiProperty({
        type: [PostgresUserViewDto],
    })
    items: PostgresUserViewDto[];
}

export class PostgresMeViewDto {
    @ApiProperty()
    userId: string;
    @ApiProperty()
    login: string;
    @ApiProperty()
    email: string;

    static mapToView(user: PostgresUser): PostgresMeViewDto {
        const dto = new PostgresMeViewDto();

        dto.userId = user.id.toString();
        dto.login = user.login;
        dto.email = user.email;

        return dto;
    }
}
