
type TokenType = 'Bearer';
type RoleType = 'Admin'

interface Role {
  uuid: string,
  name: RoleType
}

export interface LoginResponse {
  uuid: string,
  username: string,
  token: string,
  tokenType: TokenType,
  role: Role
}
