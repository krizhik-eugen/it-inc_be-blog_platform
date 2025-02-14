import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { LikeStatus } from '../../../../domain/like.entity';
import { UpdateLikeDto } from '../../../../dto/update/update-like.dto';

export class UpdateLikeInputDto implements UpdateLikeDto {
    @ApiProperty({
        type: String,
        default: LikeStatus.None,
        enum: LikeStatus,
    })
    @IsEnum(LikeStatus)
    status: LikeStatus;
}
