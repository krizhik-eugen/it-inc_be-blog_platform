import { ApiProperty } from '@nestjs/swagger';
import { PaginatedViewDto } from '../../../../../core/dto';
import { User } from '../../../domain/user.entity';

export class UserViewDto {
    @ApiProperty()
    id: string;
    @ApiProperty()
    login: string;
    @ApiProperty()
    email: string;
    @ApiProperty()
    createdAt: string;

    static mapToView(user: User): UserViewDto {
        const dto = new UserViewDto();

        dto.id = user.id.toString();
        dto.login = user.login;
        dto.email = user.email;
        dto.createdAt = new Date(user.created_at).toISOString();

        return dto;
    }
}

export class PaginatedUsersViewDto extends PaginatedViewDto<UserViewDto[]> {
    @ApiProperty({
        type: [UserViewDto],
    })
    items: UserViewDto[];
}

export class MeViewDto {
    @ApiProperty()
    userId: string;
    @ApiProperty()
    login: string;
    @ApiProperty()
    email: string;

    static mapToView(user: User): MeViewDto {
        const dto = new MeViewDto();

        dto.userId = user.id.toString();
        dto.login = user.login;
        dto.email = user.email;

        return dto;
    }
}
