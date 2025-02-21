import { InjectModel } from '@nestjs/mongoose';
import { NotFoundDomainException } from '../../../../core/exceptions';
import {
    Session,
    SessionDocument,
    SessionModelType,
} from '../../domain/session.entity';

export class SessionsRepository {
    constructor(
        @InjectModel(Session.name) private SessionModel: SessionModelType,
    ) {}

    async save(session: SessionDocument): Promise<SessionDocument> {
        return session.save();
    }

    async findByDeviceIdNonDeletedOrNotFoundFail(
        deviceId: string,
    ): Promise<SessionDocument> {
        const session = await this.SessionModel.findOne({
            deviceId,
            deletedAt: null,
        });

        if (!session) {
            throw NotFoundDomainException.create('Session is not found');
        }

        return session;
    }

    async deleteAllSessionsExceptCurrent({
        userId,
        deviceId,
    }: {
        userId: string;
        deviceId: string;
    }): Promise<number> {
        const result = await this.SessionModel.updateMany(
            {
                userId,
                deviceId: { $ne: deviceId },
            },
            {
                deletedAt: new Date().toISOString(),
            },
        );

        return result.modifiedCount;
    }
}
