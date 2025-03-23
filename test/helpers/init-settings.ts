// import { getConnectionToken } from '@nestjs/mongoose';
// import { Connection } from 'mongoose';
// import { HttpServer } from '@nestjs/common';
// import { Test, TestingModuleBuilder } from '@nestjs/testing';
// import { initAppModule } from '../../src/init-app-module';
// import { EmailService } from '../../src/modules/notifications/email.service';
// import { CoreConfig } from '../../src/core/config';
// import { EmailServiceMock } from '../mock/email-service.mock';
// import { appSetup } from '../../src/setup/app.setup';
// import { UsersTestManager } from './users-test-manager';
// import { deleteAllData } from './delete-all-data';
// import { GLOBAL_PREFIX } from '../../src/setup/global-prefix.setup';
// import { AuthTestManager } from './auth-test-manager';

// export const prefix = GLOBAL_PREFIX.length ? `/${GLOBAL_PREFIX}` : '';

// export const initSettings = async (
//     //pass a callback that receives a ModuleBuilder if you want to change the configuration of the test module
//     addSettingsToModuleBuilder?: (moduleBuilder: TestingModuleBuilder) => void,
// ) => {
//     const DynamicAppModule = await initAppModule();
//     const testingModuleBuilder: TestingModuleBuilder = Test.createTestingModule(
//         {
//             imports: [DynamicAppModule],
//         },
//     )
//         .overrideProvider(EmailService)
//         .useClass(EmailServiceMock);

//     if (addSettingsToModuleBuilder) {
//         addSettingsToModuleBuilder(testingModuleBuilder);
//     }

//     const testingAppModule = await testingModuleBuilder.compile();

//     const app = testingAppModule.createNestApplication();
//     const coreConfig = app.get<CoreConfig>(CoreConfig);
//     appSetup(app, coreConfig, DynamicAppModule);

//     await app.init();

//     const databaseConnection = app.get<Connection>(getConnectionToken());
//     const httpServer = app.getHttpServer() as HttpServer;
//     const userTestManger = new UsersTestManager(app);
//     const authTestManger = new AuthTestManager(app);

//     await deleteAllData(app);

//     return {
//         app,
//         databaseConnection,
//         httpServer,
//         userTestManger,
//         authTestManger,
//     };
// };
