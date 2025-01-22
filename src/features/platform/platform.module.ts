import { Module } from '@nestjs/common';
import { PlatformService } from './application/platform.service';
import { PlatformController } from './api/platform.controller';

@Module({
    providers: [PlatformService],
    controllers: [PlatformController],
})
export class PlatformModule {}
