import { Global, Module } from '@nestjs/common';
import { CoreConfig } from './config/core.config';
import { CqrsModule } from '@nestjs/cqrs';

@Global()
@Module({
    imports: [CqrsModule],
    providers: [CoreConfig],
    exports: [CqrsModule, CoreConfig],
})
export class CoreModule {}
