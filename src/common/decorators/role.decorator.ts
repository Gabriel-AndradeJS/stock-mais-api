import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

export const Role = (...roles: string[]) => {
  return SetMetadata(ROLES_KEY, roles);
};
