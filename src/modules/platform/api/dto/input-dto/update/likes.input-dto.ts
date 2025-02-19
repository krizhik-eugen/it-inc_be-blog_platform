import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { UpdateLikeDto } from '../../../../dto/update';
import { LikeStatus } from '../../../../domain/like.entity';

export class UpdateLikeInputDto implements UpdateLikeDto {
    @ApiProperty({
        type: String,
        default: LikeStatus.None,
        enum: LikeStatus,
    })
    @IsEnum(LikeStatus)
    likeStatus: LikeStatus;
}
