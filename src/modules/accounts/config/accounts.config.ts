import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';
import { configValidationUtility } from '../../../core/config';

@Injectable()
export class AccountsConfig {
    @IsNumber(
        {},
        {
            message:
                'Env variable CONFIRMATION_CODE_EXPIRATION_TIME_IN_HOURS must be an integer, example: 1',
        },
    )
    @IsNotEmpty({
        message:
            'Set Env variable CONFIRMATION_CODE_EXPIRATION_TIME_IN_HOURS, example: 1',
    })
    confirmationCodeExpirationTimeInHours: number = Number(
        this.configService.get('CONFIRMATION_CODE_EXPIRATION_TIME_IN_HOURS'),
    );

    @IsNumber(
        {},
        {
            message:
                'Env variable CONFIRMATION_CODE_EXPIRATION_TIME_IN_HOURS must be an integer, example: 1',
        },
    )
    @IsNotEmpty({
        message:
            'Set Env variable RECOVERY_CODE_EXPIRATION_TIME_IN_HOURS, example: 1',
    })
    recoveryCodeExpirationTimeInHours: number = Number(
        this.configService.get('RECOVERY_CODE_EXPIRATION_TIME_IN_HOURS'),
    );

    @IsNotEmpty({
        message: 'Set Env variable ACCESS_TOKEN_EXPIRATION_TIME, example: 10m',
    })
    accessTokenExpirationTime: string = this.configService.get(
        'ACCESS_TOKEN_EXPIRATION_TIME',
    ) as string;

    @IsNotEmpty({
        message: 'Set Env variable REFRESH_TOKEN_EXPIRATION_TIME, example: 1h',
    })
    refreshTokenExpirationTime: string = this.configService.get(
        'REFRESH_TOKEN_EXPIRATION_TIME',
    ) as string;

    @IsNotEmpty({
        message: 'Set Env variable JWT_SECRET, example: your-secret',
    })
    jwtSecret: string = this.configService.get('JWT_SECRET') as string;

    @IsNotEmpty({
        message: 'Set Env variable LOGIN, example: basic auth login',
    })
    adminLogin: string = this.configService.get('ADMIN_LOGIN') as string;

    @IsNotEmpty({
        message: 'Set Env variable PASSWORD, example: basic auth password',
    })
    adminPassword: string = this.configService.get('ADMIN_PASSWORD') as string;

    @IsBoolean({
        message:
            'Set Env variable IS_USER_AUTOMATICALLY_CONFIRMED to confirm user registration, example: true, available values: true, false',
    })
    isUserAutomaticallyConfirmed: boolean =
        configValidationUtility.convertToBoolean(
            this.configService.get('IS_USER_AUTOMATICALLY_CONFIRMED') as string,
        ) as boolean;

    constructor(private configService: ConfigService) {
        configValidationUtility.validateConfig(this);
    }
}
