import { EventMemberAdditionalDataResponse } from "./event-member-additional-data.interface";
import { DependenceResponse } from "./dependence.interface";
import { EventFileResponse } from "./event-file.interface";
import { EventResponse } from "./event.interface";
import { MemberResponse } from "./member.interface";

export interface EventMemberResponse {
  uuid: string,
  fullName: string,
  full_name: string,
  child_name: string | null,
  school_level: string | null,
  observations: string,
  approved: boolean,
  status: boolean,
  event: EventResponse,
  member: MemberResponse,
  dependence: DependenceResponse,
  eventFile: EventFileResponse,
  additionalStates: EventMemberAdditionalDataResponse[]
}
