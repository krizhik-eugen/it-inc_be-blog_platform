import { NotFoundDomainException } from '../../../../core/exceptions';
import { DataSource } from 'typeorm';
import { PostgresSession } from '../../domain/session.postgres-entity';

export class PostgresSessionsRepository {
    constructor(private dataSource: DataSource) {}

    async createSession({
        userId,
        deviceId,
        deviceName,
        ip,
        iat,
        exp,
    }: {
        userId: number;
        deviceId: string;
        deviceName: string;
        ip: string;
        iat: number;
        exp: number;
    }): Promise<number> {
        const result: PostgresSession[] = await this.dataSource.query(
            `
                INSERT INTO sessions (user_id, device_id, device_name, ip, iat, exp)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id
            `,
            [userId, deviceId, deviceName, ip, iat, exp],
        );

        return result[0].id;
    }

    async findByDeviceIdNonDeleted(
        deviceId: string,
    ): Promise<PostgresSession | null> {
        const sessions: PostgresSession[] = await this.dataSource.query(
            `
                SELECT * FROM sessions
                WHERE device_id = $1
                AND deleted_at IS NULL
            `,
            [deviceId],
        );

        return sessions[0] || null;
    }

    async findByDeviceIdNonDeletedOrNotFoundFail(
        deviceId: string,
    ): Promise<PostgresSession> {
        const session = await this.findByDeviceIdNonDeleted(deviceId);

        if (!session) {
            throw NotFoundDomainException.create(
                'PostgresSession is not found',
            );
        }

        return session;
    }

    async makeSessionDeletedById(id: number): Promise<void> {
        await this.dataSource.query(
            `
                UPDATE sessions
                SET deleted_at = NOW()
                WHERE id = $1
            `,
            [id],
        );
    }

    async deleteAllSessionsExceptCurrent({
        userId,
        deviceId,
    }: {
        userId: number;
        deviceId: string;
    }): Promise<void> {
        await this.dataSource.query(
            `
                UPDATE sessions
                SET deleted_at = NOW()
                WHERE user_id = $1
                AND device_id != $2
            `,
            [userId, deviceId],
        );
    }
}
