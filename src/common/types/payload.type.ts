import { Role } from 'src/common/enums/role.enum';

export interface PayloadType {
  sub: number;
  email: string;
  role: Role;
}
