export class UserPasswordRecoveryEvent {
    constructor(
        public readonly email: string,
        public confirmationCode: string,
    ) {}
}
