export class CreateSessionDomainDto {
    userId: string;
    deviceId: string;
    iat: number;
    exp: number;
    deviceName: string;
    ip: string;
}
