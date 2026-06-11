export interface RoleResponse {
  uuid: string;
  name: string;
  description: string;
  status: boolean;
}

export interface RoleUpdateInterface {
  uuid?: string;
  name: string;
  description: string;
  status: boolean;
}
