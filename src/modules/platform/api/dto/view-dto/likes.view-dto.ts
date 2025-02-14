import { ApiProperty } from '@nestjs/swagger';
import { LikeStatus } from '../../../domain/like.entity';

export class LikeViewDto {
    @ApiProperty()
    addedAt: string;
    @ApiProperty()
    userId: string;
    @ApiProperty()
    login: string;
}

export class LikesInfoViewDto {
    @ApiProperty()
    likesCount: number;
    @ApiProperty()
    dislikesCount: number;
    @ApiProperty({ default: LikeStatus.None })
    myStatus: LikeStatus;
}

export class ExtendedLikesInfo {
    @ApiProperty()
    likesCount: number;
    @ApiProperty()
    dislikesCount: number;
    @ApiProperty({ default: LikeStatus.None })
    myStatus: LikeStatus;
    @ApiProperty({
        type: [LikeViewDto],
    })
    newestLikes: LikeViewDto[];
}
