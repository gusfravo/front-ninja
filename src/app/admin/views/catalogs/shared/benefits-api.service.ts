import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IS_TOKENENABLED } from '@core/auth/context/auth.context';
import { URL } from '@shared/constants/url.constant';
import { ApiNinjaEndpoints } from '@shared/enums/api-ninja-endpoints.enum';
import { BenefitInterface } from '@shared/interfaces';


@Injectable({
  providedIn: 'root'
})
export class BenefitApiService {
  constructor(private readonly http: HttpClient) { }

  public onList() {
    return this.http.get<BenefitInterface[]>(URL + ApiNinjaEndpoints.benefitList, { context: new HttpContext().set(IS_TOKENENABLED, true) }).pipe();
  }

}
