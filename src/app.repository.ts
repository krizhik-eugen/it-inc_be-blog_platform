import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AppRepository {
    constructor(private dataSource: DataSource) {}
    async getAllUsers() {
        let data;
        try {
            data = await this.dataSource.query(`
                SELECT * FROM public."TestUsers"
                `);
        } catch (e) {
            console.log('e', e);
        }

        console.log('data', data);

        return data.map((user) => ({
            id: user.id,
            FirstName: user.FirstName,
            LastName: user.LastName,
            IsMarried: user.IsMarried,
            PassportNumber: user.PassportNumber,
        }));
    }

    async getUserById(id: string) {
        let data;
        try {
            data = await this.dataSource.query(
                `
                SELECT * FROM public."TestUsers"
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
            FirstName: user.FirstName,
            LastName: user.LastName,
            IsMarried: user.IsMarried,
            PassportNumber: user.PassportNumber,
        }));
    }
}
