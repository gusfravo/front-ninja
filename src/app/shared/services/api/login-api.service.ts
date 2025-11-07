import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { URL } from '@shared/constants/url.constant';
import { login } from '@shared/domain';
import { ApiNinjaEndpoints } from '@shared/enums/api-ninja-endpoints.enum';
import { LoginResponse } from '@shared/interfaces/login-response.interface';


@Injectable({
  providedIn: 'root'
})
export class LoginApiService {
  constructor(private readonly http: HttpClient) { }

  public onLogin(login: login) {
    return this.http.post<LoginResponse>(URL + ApiNinjaEndpoints.login, login).pipe();
  }

}

