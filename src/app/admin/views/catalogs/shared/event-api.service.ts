import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IS_TOKENENABLED } from '@core/auth/context/auth.context';
import { URL } from '@shared/constants/url.constant';
import { ApiNinjaEndpoints } from '@shared/enums/api-ninja-endpoints.enum';
import { EventInterface, EventResponse, EventUpdateInterface } from '@shared/interfaces/event.interface';


@Injectable({
  providedIn: 'root'
})
export class EventApiService {
  private secury = { context: new HttpContext().set(IS_TOKENENABLED, true) };
  constructor(private readonly http: HttpClient) { }

  public onList() {
    return this.http.get<EventResponse[]>(URL + ApiNinjaEndpoints.eventList, this.secury).pipe();
  }

  public onGet(uuid: string) {
    return this.http.get<EventResponse>(URL + ApiNinjaEndpoints.eventGet + uuid, this.secury);
  }

  public onSave(data: EventUpdateInterface) {
    return this.http.post(URL + ApiNinjaEndpoints.eventUpdate, data, this.secury)
  }

}
