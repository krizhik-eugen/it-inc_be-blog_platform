import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function swaggerSetup(app: INestApplication) {
    const config = new DocumentBuilder()
        .setTitle('BLOG PLATFORM API')
        .addBearerAuth()
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document, {
        customSiteTitle: 'Blog Platform Swagger',
    });
}
