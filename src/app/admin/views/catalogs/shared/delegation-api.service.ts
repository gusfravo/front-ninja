import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IS_TOKENENABLED } from '@core/auth/context/auth.context';
import { URL } from '@shared/constants/url.constant';
import { ApiNinjaEndpoints } from '@shared/enums/api-ninja-endpoints.enum';
import { DelegationRequestList, DelegationResponse, DelegationUpdateInterface } from '@shared/interfaces';


@Injectable({
  providedIn: 'root'
})
export class DelegationApiService {
  private secury = { context: new HttpContext().set(IS_TOKENENABLED, true) };
  constructor(private readonly http: HttpClient) { }

  public onList(data: DelegationRequestList) {
    return this.http.post<DelegationResponse[]>(URL + ApiNinjaEndpoints.delegationList, data, this.secury).pipe();
  }

  public onSave(data: DelegationUpdateInterface) {
    return this.http.post<DelegationResponse>(URL + ApiNinjaEndpoints.delegationUpdate, data, this.secury);
  }

  public onGet(uuid: string) {
    return this.http.get<DelegationResponse>(URL + ApiNinjaEndpoints.delegationGet + uuid, this.secury);
  }

  public onDelete(uuid: string) {
    return this.http.delete<DelegationResponse>(URL + ApiNinjaEndpoints.delegationDelete + uuid, this.secury);
  }
}
