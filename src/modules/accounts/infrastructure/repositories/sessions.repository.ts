import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { NotFoundDomainException } from '../../../../core/exceptions';
import { SessionEntity } from '../../domain/session.entity';

@Injectable()
export class SessionsRepository {
    constructor(
        @InjectRepository(SessionEntity)
        private readonly sessionsRepo: Repository<SessionEntity>,
    ) {}

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
        const newSession = this.sessionsRepo.create({
            user_id: userId,
            device_id: deviceId,
            device_name: deviceName,
            ip,
            iat,
            exp,
        });

        await this.sessionsRepo.save(newSession);

        return newSession.id;
    }

    async findByDeviceIdNonDeleted(
        deviceId: string,
    ): Promise<SessionEntity | null> {
        const result = await this.sessionsRepo.findOneBy({
            device_id: deviceId,
            deleted_at: IsNull(),
        });

        return result;
    }

    async findByDeviceIdNonDeletedOrNotFoundFail(
        deviceId: string,
    ): Promise<SessionEntity> {
        const session = await this.findByDeviceIdNonDeleted(deviceId);

        if (!session) {
            throw NotFoundDomainException.create('Session is not found');
        }

        return session;
    }

    async makeSessionDeletedById(id: number): Promise<void> {
        await this.sessionsRepo.softDelete(id);
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
        await this.sessionsRepo.update(
            { device_id: deviceId },
            { ip, iat, exp },
        );
    }

    async deleteAllSessionsExceptCurrent({
        userId,
        deviceId,
    }: {
        userId: number;
        deviceId: string;
    }): Promise<void> {
        await this.sessionsRepo.softDelete({
            user_id: userId,
            device_id: Not(deviceId),
        });
    }
}
