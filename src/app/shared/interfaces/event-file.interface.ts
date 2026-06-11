import { DelegationResponse } from "./delegation.interface";
import { EventResponse } from "./event.interface";

export interface EventFileResponse {
  uuid: string,
  event: EventResponse,
  delegation: DelegationResponse,
  deletation: DelegationResponse,
  dependence_name: string | null
}
