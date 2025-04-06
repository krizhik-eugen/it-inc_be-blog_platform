import { ApiProperty } from '@nestjs/swagger';
import { SessionEntity } from '../../../domain/session.entity';

export class SessionViewDto {
    @ApiProperty()
    ip: string;
    @ApiProperty()
    title: string;
    @ApiProperty()
    lastActiveDate: string;
    @ApiProperty()
    deviceId: string;

    static mapToView(session: SessionEntity): SessionViewDto {
        const dto = new SessionViewDto();

        dto.ip = session.ip;
        dto.title = session.device_name;
        dto.lastActiveDate = new Date(session.iat * 1000).toISOString();
        dto.deviceId = session.device_id;

        return dto;
    }
}
