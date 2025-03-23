import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { SessionViewDto } from '../../api/dto/view-dto/sessions.view-dto';
import { Session } from '../../domain/session.entity';

@Injectable()
export class SessionsQueryRepository {
    constructor(private dataSource: DataSource) {}

    async getAllSessionsDevices(userId: number): Promise<SessionViewDto[]> {
        const sessions: Session[] = await this.dataSource.query(
            `SELECT * FROM sessions WHERE user_id = $1 AND deleted_at IS NULL`,
            [userId],
        );
        return sessions.map((session) => SessionViewDto.mapToView(session));
    }
}
