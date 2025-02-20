import { ApiProperty } from '@nestjs/swagger';
import { SessionDocument } from '../../../domain/session.entity';

export class SessionViewDto {
    @ApiProperty()
    ip: string;
    @ApiProperty()
    title: string;
    @ApiProperty()
    lastActiveDate: string;
    @ApiProperty()
    deviceId: string;

    static mapToView(session: SessionDocument): SessionViewDto {
        const dto = new SessionViewDto();

        dto.ip = session.ip;
        dto.title = session.deviceName;
        dto.lastActiveDate = new Date(session.iat * 1000).toISOString();
        dto.deviceId = session.deviceId;

        return dto;
    }
}
