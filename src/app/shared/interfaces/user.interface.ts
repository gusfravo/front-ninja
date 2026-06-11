import { RoleResponse } from './role.interface';

export interface UserResponse {
  uuid: string;
  username: string;
  full_name: string;
  status: boolean;
  role: RoleResponse;
}

export interface UserUpdateInterface {
  uuid?: string;
  username: string;
  fullName: string;
  password?: string;
  status: boolean;
  roleId: string;
}
