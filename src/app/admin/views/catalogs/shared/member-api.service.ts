import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IS_TOKENENABLED } from '@core/auth/context/auth.context';
import { URL } from '@shared/constants/url.constant';
import { ApiNinjaEndpoints } from '@shared/enums/api-ninja-endpoints.enum';
import { MemberResponse } from '@shared/interfaces/member.interface';

@Injectable({ providedIn: 'root' })
export class MemberApiService {
  private secury = { context: new HttpContext().set(IS_TOKENENABLED, true) };

  constructor(private readonly http: HttpClient) {}

  listByName(name: string) {
    return this.http.get<MemberResponse[]>(
      URL + ApiNinjaEndpoints.memberListByName + encodeURIComponent(name),
      this.secury,
    );
  }
}
