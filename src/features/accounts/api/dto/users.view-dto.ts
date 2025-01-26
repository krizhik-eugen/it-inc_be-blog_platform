import { ApiProperty } from '@nestjs/swagger';
import { UserDocument } from '../../domain/user.entity';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';

export class UserViewDto {
    @ApiProperty()
    id: string;
    @ApiProperty()
    login: string;
    @ApiProperty()
    email: string;
    @ApiProperty()
    createdAt: string;

    static mapToView(user: UserDocument): UserViewDto {
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
