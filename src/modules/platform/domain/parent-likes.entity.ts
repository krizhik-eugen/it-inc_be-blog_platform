import { Prop } from '@nestjs/mongoose';
import { UpdateLikesCountDomainDto } from './dto/update';

export abstract class ParentLikesEntity {
    /**
     * Likes count of the parent entity
     * @type {number}
     * @required
     */
    @Prop({
        type: Number,
        required: true,
        default: 0,
    })
    likesCount: number;

    /**
     * Dislikes count of the parent entity
     * @type {number}
     * @required
     */
    @Prop({
        type: Number,
        required: true,
        default: 0,
    })
    dislikesCount: number;

    /**
     * Factory method to update a parent entity with likes count
     * @param {UpdateLikesCountDomainDto} dto - The data transfer object for entity change likes count
     */
    updateLikesCount(dto: UpdateLikesCountDomainDto) {
        this.likesCount = dto.likesCount;
        this.dislikesCount = dto.dislikesCount;
    }
}
