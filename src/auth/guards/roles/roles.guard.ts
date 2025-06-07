import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role, User } from 'generated/prisma';
import { Observable } from 'rxjs';
import { ROLES_KEY } from 'src/auth/decorators/role.decorator';
import { AuthenticatedRequest } from 'src/auth/types/auth.jwtPayload';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // If no roles are required, allow access
    }

    const request: AuthenticatedRequest = context.switchToHttp().getRequest();
    const user: User = request.user;

    const hasRequiredRole = requiredRoles.some((role) => {
      return user.role === role;
    });

    return hasRequiredRole;
  }
}
