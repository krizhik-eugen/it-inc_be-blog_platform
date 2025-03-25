import { LikeParentType, LikeStatus } from '../../like.entity';

export class CreateLikeDomainDto {
    userId: number;
    parentId: number;
    parentType: LikeParentType;
    status: LikeStatus;
}
