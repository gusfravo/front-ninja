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
  private secury = { context: new HttpContext().set(IS_TOKENENABLED, true) };
  constructor(private readonly http: HttpClient) { }

  public onList() {
    return this.http.get<BenefitInterface[]>(URL + ApiNinjaEndpoints.benefitList, this.secury).pipe();
  }

  public onSave(data: BenefitInterface) {
    delete data.created_at;
    delete data.updated_at;
    return this.http.post(URL + ApiNinjaEndpoints.benefitUpdate, data, this.secury)
  }

  public onGet(uuid: string) {
    return this.http.get<BenefitInterface>(URL + ApiNinjaEndpoints.benefitGet + uuid, this.secury)
  }

}
