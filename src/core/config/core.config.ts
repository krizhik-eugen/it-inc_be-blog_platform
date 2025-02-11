import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    IsBoolean,
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsNumber,
} from 'class-validator';
import { configValidationUtility } from './config-validation.utility';

export enum Environments {
    DEVELOPMENT = 'development',
    STAGING = 'staging',
    PRODUCTION = 'production',
    TESTING = 'testing',
}

// each module has it's own *.config.ts

@Injectable()
export class CoreConfig {
    @IsNumber(
        {},
        {
            message: 'Set Env variable PORT, example: 3000',
        },
    )
    port: number = Number(this.configService.get('PORT'));

    @IsEnum(Environments, {
        message:
            'Ser correct NODE_ENV value, available values: ' +
            configValidationUtility.getEnumValues(Environments).join(', '),
    })
    nodeEnv: string = this.configService.get('NODE_ENV') as string;

    @IsNotEmpty({
        message: 'Set Env variable MONGO_URL, example: mongodb://localhost/',
    })
    mongoURL: string = this.configService.get('MONGO_URL') as string;

    @IsNotEmpty({
        message: 'Set Env variable DB_NAME, example: database-name',
    })
    mongoDBName: string = this.configService.get('MONGO_DB_NAME') as string;

    @IsEmail()
    @IsNotEmpty({
        message:
            'Set Env variable EMAIL_BLOG_PLATFORM, example: example@example.com',
    })
    hostEmailLogin: string = this.configService.get(
        'HOST_EMAIL_LOGIN',
    ) as string;

    @IsNotEmpty({
        message: 'Set Env variable EMAIL_BLOG_PLATFORM_PASSWORD',
    })
    hostEmailPassword: string = this.configService.get(
        'HOST_EMAIL_PASSWORD',
    ) as string;

    @IsBoolean({
        message:
            'Set Env variable IS_SWAGGER_ENABLED to enable/disable Swagger, example: true, available values: true, false',
    })
    isSwaggerEnabled: boolean = configValidationUtility.convertToBoolean(
        this.configService.get('IS_SWAGGER_ENABLED') as string,
    ) as boolean;

    @IsBoolean({
        message:
            'Set Env variable INCLUDE_TESTING_MODULE to enable/disable Dangerous for production TestingModule, example: true, available values: true, false, 0, 1',
    })
    includeTestingModule: boolean = configValidationUtility.convertToBoolean(
        this.configService.get('INCLUDE_TESTING_MODULE') as string,
    ) as boolean;

    constructor(private configService: ConfigService) {
        configValidationUtility.validateConfig(this);
    }
}
