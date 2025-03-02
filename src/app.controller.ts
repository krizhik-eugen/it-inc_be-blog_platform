import { Controller, Get, Param } from '@nestjs/common';
import { AppRepository } from './app.repository';

@Controller()
export class AppController {
    constructor(private appRepository: AppRepository) {}

    @Get()
    async getAllUsers() {
        return this.appRepository.getAllUsers();
    }

    @Get(':id')
    async getUserById(@Param('id') id: string) {
        return this.appRepository.getUserById(id);
    }
}
