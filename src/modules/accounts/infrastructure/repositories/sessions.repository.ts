import { Injectable } from '@nestjs/common';
import { NotFoundDomainException } from '../../../../core/exceptions';
import { DataSource } from 'typeorm';
import { Session } from '../../domain/session.entity';

@Injectable()
export class SessionsRepository {
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
        const result: Session[] = await this.dataSource.query(
            `
                INSERT INTO sessions (user_id, device_id, device_name, ip, iat, exp)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id
            `,
            [userId, deviceId, deviceName, ip, iat, exp],
        );

        return result[0].id;
    }

    async findByDeviceIdNonDeleted(deviceId: string): Promise<Session | null> {
        const sessions: Session[] = await this.dataSource.query(
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
    ): Promise<Session> {
        const session = await this.findByDeviceIdNonDeleted(deviceId);

        if (!session) {
            throw NotFoundDomainException.create('Session is not found');
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

    async updateSession({
        deviceId,
        ip,
        iat,
        exp,
    }: {
        deviceId: string;
        ip: string;
        iat: number;
        exp: number;
    }): Promise<void> {
        await this.dataSource.query(
            `
                UPDATE sessions
                SET ip = $1, iat = $2, exp = $3, updated_at = NOW()
                WHERE device_id = $4
                AND deleted_at IS NULL
            `,
            [ip, iat, exp, deviceId],
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
