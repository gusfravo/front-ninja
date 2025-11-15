import { EventMemberResponse } from "./event-member.interface";

export interface EventMemberAdditionalDataResponse {
  uuid: string,
  key: string,
  value: boolean,
  eventMember: EventMemberResponse
}
