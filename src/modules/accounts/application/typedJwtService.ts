import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DecodeOptions, JwtPayload } from 'jsonwebtoken';

export interface TypedJwtPayload extends JwtPayload {
    userId: number;
    deviceId: string;
}

@Injectable()
export class TypedJwtService extends JwtService {
    decode<T = TypedJwtPayload>(token: string, options?: DecodeOptions): T {
        const decoded: T = super.decode(token, options);
        return decoded;
    }
}
