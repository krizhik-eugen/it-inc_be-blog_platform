import { ApiProperty } from '@nestjs/swagger';
import { PaginatedViewDto } from '../../../../../core/dto';
import { PostgresUser } from '../../../domain/user.entity';

export class PostgresUserViewDto {
    @ApiProperty()
    id: string;
    @ApiProperty()
    login: string;
    @ApiProperty()
    email: string;
    @ApiProperty()
    createdAt: string;

    static mapToView(user: PostgresUser): PostgresUserViewDto {
        const dto = new PostgresUserViewDto();

        dto.id = user.id.toString();
        dto.login = user.login;
        dto.email = user.email;
        dto.createdAt = new Date(user.created_at).toISOString();

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
