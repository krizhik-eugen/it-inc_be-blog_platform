import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SessionViewDto } from '../../api/dto/view-dto/sessions.view-dto';
import { SessionEntity } from '../../domain/session.entity';

@Injectable()
export class SessionsQueryRepository {
    constructor(
        @InjectRepository(SessionEntity)
        private readonly sessionsRepo: Repository<SessionEntity>,
    ) {}

    async getAllSessionsDevices(userId: number): Promise<SessionViewDto[]> {
        const sessions = await this.sessionsRepo
            .createQueryBuilder('s')
            .where('s.user_id = :userId', { userId })
            .andWhere('s.deleted_at IS NULL')
            .getMany();

        return sessions.map((session) => SessionViewDto.mapToView(session));
    }
}
