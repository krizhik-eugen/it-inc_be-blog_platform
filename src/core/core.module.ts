import { Global, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CoreConfig } from './config';

@Global()
@Module({
    imports: [CqrsModule],
    providers: [CoreConfig],
    exports: [CqrsModule, CoreConfig],
})
export class CoreModule {}
