import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IS_TOKENENABLED } from '@core/auth/context/auth.context';
import { URL } from '@shared/constants/url.constant';
import { ApiNinjaEndpoints } from '@shared/enums/api-ninja-endpoints.enum';
import { UserResponse, UserUpdateInterface } from '@shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {
  private secury = { context: new HttpContext().set(IS_TOKENENABLED, true) };

  constructor(private readonly http: HttpClient) {}

  public onList() {
    return this.http.get<UserResponse[]>(URL + ApiNinjaEndpoints.userList, this.secury);
  }

  public onGet(uuid: string) {
    return this.http.get<UserResponse>(URL + ApiNinjaEndpoints.userGet + uuid, this.secury);
  }

  public onSave(data: UserUpdateInterface) {
    return this.http.post<UserResponse>(URL + ApiNinjaEndpoints.userUpdate, data, this.secury);
  }

  public onDelete(uuid: string) {
    return this.http.delete<void>(URL + ApiNinjaEndpoints.userDelete + uuid, this.secury);
  }
}
