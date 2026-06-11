import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IS_TOKENENABLED } from '@core/auth/context/auth.context';
import { URL } from '@shared/constants/url.constant';
import { ApiNinjaEndpoints } from '@shared/enums/api-ninja-endpoints.enum';
import { RoleResponse, RoleUpdateInterface } from '@shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class RoleApiService {
  private secury = { context: new HttpContext().set(IS_TOKENENABLED, true) };

  constructor(private readonly http: HttpClient) {}

  public onList() {
    return this.http.get<RoleResponse[]>(URL + ApiNinjaEndpoints.roleList, this.secury);
  }

  public onGet(uuid: string) {
    return this.http.get<RoleResponse>(URL + ApiNinjaEndpoints.roleGet + uuid, this.secury);
  }

  public onSave(data: RoleUpdateInterface) {
    return this.http.post<RoleResponse>(URL + ApiNinjaEndpoints.roleUpdate, data, this.secury);
  }

  public onDelete(uuid: string) {
    return this.http.delete<void>(URL + ApiNinjaEndpoints.roleDelete + uuid, this.secury);
  }
}
