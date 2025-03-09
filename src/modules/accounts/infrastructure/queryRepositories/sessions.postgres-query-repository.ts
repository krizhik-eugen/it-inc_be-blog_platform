import { DataSource } from 'typeorm';
import { PostgresSessionViewDto } from '../../api/dto/view-dto/sessions.view-dto';
import { PostgresSession } from '../../domain/session.postgres-entity';

export class PostgresSessionsQueryRepository {
    constructor(private dataSource: DataSource) {}

    async getAllSessionsDevices(
        userId: number,
    ): Promise<PostgresSessionViewDto[]> {
        const sessions: PostgresSession[] = await this.dataSource.query(
            `SELECT * FROM sessions WHERE user_id = $1`,
            [userId],
        );
        return sessions.map((session) =>
            PostgresSessionViewDto.mapToView(session),
        );
    }
}
