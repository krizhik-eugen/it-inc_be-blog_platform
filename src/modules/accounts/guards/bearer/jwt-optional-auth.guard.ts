import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtOptionalAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
        return super.canActivate(context);
    }

    handleRequest<TUser = any>(
        err: any,
        user: TUser,
        // info?: any,
        // context?: ExecutionContext,
        // status?: any,
    ): TUser | null {
        // We will not call the base class method here, it contains the following:
        // throws an error if there is no user or if another error occurs (for example, JWT has expired)...
        // handleRequest(err, user, info, context, status) {
        //   if (err || !user) {
        //     throw err || new common_1.UnauthorizedException();
        //   }
        //   return user;
        // }
        // Instead, we will simply return null and not process the error and null

        if (err || !user) {
            return null;
        } else {
            return user;
        }
    }
}
