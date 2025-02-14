import { LikeStatus } from '../../like.entity';

export class CreateLikeDomainDto {
    userId: string;
    parentId: string;
    status: LikeStatus;
}
