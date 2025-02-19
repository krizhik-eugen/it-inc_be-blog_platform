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

    async findByDeviceIdOrNotFoundFail(
        deviceId: string,
    ): Promise<SessionDocument> {
        const session = await this.SessionModel.findOne({ deviceId });

        if (!session) {
            throw NotFoundDomainException.create('Session is not found');
        }

        return session;
    }

    async deleteByDeviceId(deviceId: string): Promise<number> {
        const result = await this.SessionModel.deleteOne({ deviceId });
        return result.deletedCount;
    }

    async deleteAllSessionsExceptCurrent({
        userId,
        deviceId,
    }: {
        userId: string;
        deviceId: string;
    }) {
        const result = await this.SessionModel.deleteMany({
            userId,
            deviceId: { $ne: deviceId },
        });

        return result.deletedCount;
    }
}
