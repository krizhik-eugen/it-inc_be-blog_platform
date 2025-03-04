import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class UsersPostgresQueryRepository {
    constructor(private dataSource: DataSource) {}
    async getAllUsers() {
        let data;
        try {
            data = await this.dataSource.query(`
                SELECT * FROM public.users JOIN public.email_confirmation ON users.id = email_confirmation.user_id JOIN public.password_recovery ON users.id = password_recovery.user_id
                `);
        } catch (e) {
            console.log('e', e);
        }

        console.log('data', data);

        return data.map((user) => ({
            id: user.id,
            login: user.login,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            deletedAt: user.deletedAt,
        }));
    }

    async getUserById(id: string) {
        let data;
        try {
            data = await this.dataSource.query(
                `
                SELECT * FROM public.users
                WHERE id = $1
                `,
                [id],
            );
        } catch (e) {
            console.log('e', e);
        }

        console.log('data', data);

        return data.map((user) => ({
            id: user.id,
            login: user.login,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            deletedAt: user.deletedAt,
        }));
    }
}
