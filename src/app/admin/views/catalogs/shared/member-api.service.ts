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

  list(params: { page?: number; limit?: number; name?: string } = {}) {
    const { page = 1, limit = 20, name = '' } = params;
    const query = `?page=${page}&limit=${limit}${name ? `&name=${encodeURIComponent(name)}` : ''}`;
    return this.http.get<{ data: MemberResponse[]; total: number; page: number; limit: number; totalPages: number }>(
      URL + ApiNinjaEndpoints.memberList + query,
      this.secury,
    );
  }

  get(uuid: string) {
    return this.http.get<MemberResponse>(URL + ApiNinjaEndpoints.memberGet + uuid, this.secury);
  }

  save(data: Partial<MemberResponse> & { full_name: string; rfc: string }) {
    return this.http.post<MemberResponse>(URL + ApiNinjaEndpoints.memberUpdate, data, this.secury);
  }

  delete(uuid: string) {
    return this.http.delete<MemberResponse>(URL + ApiNinjaEndpoints.memberDelete + uuid, this.secury);
  }

  listByName(name: string) {
    return this.http.get<MemberResponse[]>(
      URL + ApiNinjaEndpoints.memberListByName + encodeURIComponent(name),
      this.secury,
    );
  }
}
