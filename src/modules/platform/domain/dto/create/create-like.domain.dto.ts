import { LikeStatus } from '../../like.entity';

export class CreateLikeDomainDto {
    userId: number;
    parentId: string;
    status: LikeStatus;
}
