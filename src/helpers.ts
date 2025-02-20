import { UAParser } from 'ua-parser-js';

export const getEmailConfirmationTemplate = (confirmationCode: string) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Confirmation</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .button {
                display: inline-block;
                padding: 10px 20px;
                margin-top: 20px;
                font-size: 16px;
                color: #fff;
                background-color: #007BFF;
                text-decoration: none;
                border-radius: 4px;
            }
            .button:hover {
                background-color: #0056b3;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Email Confirmation</h2>
            <p>Hello,</p>
            <p>Thank you for registering in our app. Please confirm your email address by clicking the link below:</p>
            <a 
            href="https://fe-blog-platform.com/auth/registration-confirmation?code=${confirmationCode}" 
            class="button">Confirm Email</a>
            <p>If the button above doesn’t work, you can copy and paste the following URL into your browser:</p>
            <p><b>https://fe-blog-platform.com/auth/registration-confirmation?code=${confirmationCode}</b></p>
            <p>Thank you!</p>
        </div>
    </body>
    </html>
`;

export const getPasswordRecoveryTemplate = (recoveryCode: string) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Recovery</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .button {
                display: inline-block;
                padding: 10px 20px;
                margin-top: 20px;
                font-size: 16px;
                color: #fff;
                background-color: #007BFF;
                text-decoration: none;
                border-radius: 4px;
            }
            .button:hover {
                background-color: #0056b3;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Password Recovery</h2>
            <p>Hello,</p>
            <p>We received a request to reset your password. You can reset your password by clicking the link below:</p>
            <a 
            href="https://fe-blog-platform.com/auth/password-recovery?recoveryCode=${recoveryCode}" 
            class="button">Reset Password</a>
            <p>If the button above doesn’t work, you can copy and paste the following URL into your browser:</p>
            <p><b>https://fe-blog-platform.com/auth/password-recovery?recoveryCode=${recoveryCode}</b></p>
            <p>If you did not request a password reset, please ignore this email.</p>
            <p>Thank you!</p>
        </div>
    </body>
    </html>
`;

export const getDeviceTitle = (userAgent = '') => {
    let deviceTitle = 'Unknown device';
    const uaData = UAParser(userAgent);
    if (uaData.device.vendor) {
        deviceTitle = `${uaData.device.vendor} ` + `${uaData.device.model}`;
    }
    if (uaData.browser.name) {
        deviceTitle += ` ${uaData.browser.name} ` + `${uaData.browser.version}`;
    }
    return deviceTitle;
};
