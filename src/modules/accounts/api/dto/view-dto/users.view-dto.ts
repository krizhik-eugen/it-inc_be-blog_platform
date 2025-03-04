import { ApiProperty } from '@nestjs/swagger';
import { MongoUserDocument } from '../../../domain/user.entity';
import { PaginatedViewDto } from '../../../../../core/dto';

export class UserViewDto {
    @ApiProperty()
    id: string;
    @ApiProperty()
    login: string;
    @ApiProperty()
    email: string;
    @ApiProperty()
    createdAt: string;

    static mapToView(user: MongoUserDocument): UserViewDto {
        const dto = new UserViewDto();

        dto.id = user._id.toString();
        dto.login = user.login;
        dto.email = user.email;
        dto.createdAt = user.createdAt;

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

    static mapToView(user: MongoUserDocument): MeViewDto {
        const dto = new MeViewDto();

        dto.userId = user._id.toString();
        dto.login = user.login;
        dto.email = user.email;

        return dto;
    }
}
