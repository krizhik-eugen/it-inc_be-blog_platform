import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { SessionViewDto } from '../../api/dto/view-dto/sessions.view-dto';
import { Session } from '../../domain/session.entity';

@Injectable()
export class SessionsQueryRepository {
    constructor(
        @InjectRepository(Session)
        private readonly sessionsRepo: Repository<Session>,
    ) {}

    async getAllSessionsDevices(userId: number): Promise<SessionViewDto[]> {
        const sessions = await this.sessionsRepo.find({
            where: { user_id: userId, deleted_at: IsNull() },
        });

        return sessions.map((session) => SessionViewDto.mapToView(session));
    }
}
