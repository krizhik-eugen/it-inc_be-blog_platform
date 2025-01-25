import { INestApplication, ValidationPipe } from '@nestjs/common';

// export const GLOBAL_PREFIX = 'api';

export function appSetup(app: INestApplication) {
    // app.setGlobalPrefix(GLOBAL_PREFIX);
    app.enableCors();
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
        }),
    );
}
