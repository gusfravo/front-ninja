import { BenefitInterface } from "./benefit.interface"

export interface EventInterface {
  uuid: string,
  status: string,
  start_date: Date,
  end_date: Date,
  benefitId: string
}

export interface EventResponse {
  uuid: string,
  status: string,
  start_date: Date,
  end_date: Date,
  benefit: BenefitInterface
}

export interface EventUpdateInterface {
  uuid: string,
  status: string,
  startDate: string,
  endDate: string,
  benefitId: string
}
