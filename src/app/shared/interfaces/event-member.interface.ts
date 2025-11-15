import { DependenceResponse } from "./dependence.interface";
import { EventFileResponse } from "./event-file.interface";
import { EventResponse } from "./event.interface";
import { MemberResponse } from "./member.interface";

export interface EventMemberResponse {
  uuid: string,
  fullName: string,
  observations: string,
  approved: boolean,
  status: boolean,
  event: EventResponse,
  member: MemberResponse,
  dependence: DependenceResponse,
  eventFile: EventFileResponse
}
