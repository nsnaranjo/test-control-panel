import { UserRoleInterface } from '@domain/interfaces';

export class UserRoleModel implements UserRoleInterface {
  constructor(
    public hasAccess: boolean,
    public roles?: string[],
    public accessRoutes?: string[],
    public lastConnection?: string,
    public error?: string,
    public message?: string,
  ) {
  }

  get isAccessDenied(): boolean {
    return !this.hasAccess;
  }
}
