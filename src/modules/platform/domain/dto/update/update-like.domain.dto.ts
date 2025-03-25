import { LikeParentType, LikeStatus } from '../../like.entity';

export class UpdateLikeDomainDto {
    parentId: number;
    parentType: LikeParentType;
    status: LikeStatus;
}
