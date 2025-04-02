export interface UserRoleInterface {
  hasAccess: boolean;
  roles?: string[];
  accessRoutes?: string[];
  lastConnection?: string;
  error?: string;
  message?: string;
}

