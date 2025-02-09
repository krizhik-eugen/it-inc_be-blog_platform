import { getConnectionToken } from '@nestjs/mongoose';
import { HttpServer } from '@nestjs/common';
import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { Connection } from 'mongoose';
import { AppModule } from '../../src/app.module';
import { appSetup } from '../../src/setup/app.setup';
import { UsersTestManager } from './users-test-manager';
import { deleteAllData } from './delete-all-data';
import { EmailService } from '../../src/modules/notifications/email.service';
import { EmailServiceMock } from '../mock/email-service.mock';

export const initSettings = async (
    addSettingsToModuleBuilder?: (moduleBuilder: TestingModuleBuilder) => void,
) => {
    const testingModuleBuilder: TestingModuleBuilder = Test.createTestingModule(
        {
            imports: [AppModule],
        },
    )
        .overrideProvider(EmailService)
        .useClass(EmailServiceMock);

    if (addSettingsToModuleBuilder) {
        addSettingsToModuleBuilder(testingModuleBuilder);
    }

    const testingAppModule = await testingModuleBuilder.compile();

    const app = testingAppModule.createNestApplication();

    appSetup(app);

    await app.init();

    const databaseConnection = app.get<Connection>(getConnectionToken());
    const httpServer = app.getHttpServer() as HttpServer;
    const userTestManger = new UsersTestManager(app);

    await deleteAllData(app);

    return {
        app,
        databaseConnection,
        httpServer,
        userTestManger,
    };
};
