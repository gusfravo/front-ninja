import { DependenceResponse } from "./dependence.interface";
import { MemberResponse } from "./member.interface";

export interface DelegationResponse {
  uuid: string,
  code: string,
  name: string,
  status: boolean,
  dependence: DependenceResponse,
  titular: MemberResponse
}

export interface DelegationRequestList {
  dependenceId: string | null,
  name: string
}

export interface DelegationUpdateInterface {
  uuid?: string;
  code: string;
  name: string;
  status: boolean;
  dependenceId: string;
  titularId?: string;
}
