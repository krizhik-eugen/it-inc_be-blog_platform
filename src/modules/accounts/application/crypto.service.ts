import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { SALT_ROUNDS } from '../constants';

@Injectable()
export class CryptoService {
    async createPasswordHash(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(SALT_ROUNDS);

        return bcrypt.hash(password, salt);
    }

    comparePasswords(args: {
        password: string;
        hash: string;
    }): Promise<boolean> {
        return bcrypt.compare(args.password, args.hash);
    }
}
