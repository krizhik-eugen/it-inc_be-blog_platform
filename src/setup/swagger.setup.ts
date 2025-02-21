import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CoreConfig } from '../core/config';

export function swaggerSetup(app: INestApplication, coreConfig: CoreConfig) {
    if (!coreConfig.isSwaggerEnabled) return;

    const config = new DocumentBuilder()
        .setTitle('BLOG PLATFORM API')
        .addBearerAuth({
            type: 'http',
            description: 'Enter JWT Bearer token only',
        })
        .addCookieAuth('refreshToken', {
            name: 'refreshToken',
            type: 'apiKey',
            in: 'cookie',
        })
        .addBasicAuth()
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document, {
        customSiteTitle: 'Blog Platform Swagger',
    });
}
