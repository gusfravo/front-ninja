import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IS_TOKENENABLED } from '@core/auth/context/auth.context';
import { URL as API_URL } from '@shared/constants/url.constant';
import { ApiNinjaEndpoints } from '@shared/enums/api-ninja-endpoints.enum';
import { finalize, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EventMemberExcelApiService {
  private readonly secury = { context: new HttpContext().set(IS_TOKENENABLED, true) };

  constructor(private readonly http: HttpClient) {}

  downloadByEvent(eventId: string) {
    return this.http
      .get(API_URL + ApiNinjaEndpoints.eventMemberExportEvent + eventId, {
        ...this.secury,
        responseType: 'blob',
      })
      .pipe(
        tap((blob) => {
          const objectUrl = window.URL.createObjectURL(blob);
          const anchor = document.createElement('a');
          anchor.href = objectUrl;
          anchor.download = 'agremiados-general.xlsx';
          anchor.click();
          window.URL.revokeObjectURL(objectUrl);
        }),
      );
  }

  downloadByEventFile(eventFileId: string, delegationName: string) {
    return this.http
      .get(API_URL + ApiNinjaEndpoints.eventMemberExport + eventFileId, {
        ...this.secury,
        responseType: 'blob',
      })
      .pipe(
        tap((blob) => {
          const objectUrl = window.URL.createObjectURL(blob);
          const anchor = document.createElement('a');
          anchor.href = objectUrl;
          anchor.download = `agremiados-${delegationName}.xlsx`;
          anchor.click();
          window.URL.revokeObjectURL(objectUrl);
        }),
      );
  }

  downloadByEventAndDependence(
    eventId: string,
    dependenceId: string,
    dependenceName: string,
    onFinalize?: () => void,
  ) {
    const url = `${API_URL}${ApiNinjaEndpoints.eventMemberExportEventDependence}${eventId}/dependence/${dependenceId}`;
    return this.http
      .get(url, { ...this.secury, responseType: 'blob' })
      .pipe(
        tap((blob) => {
          const objectUrl = window.URL.createObjectURL(blob);
          const anchor = document.createElement('a');
          anchor.href = objectUrl;
          anchor.download = `agremiados-${dependenceName}.xlsx`;
          anchor.click();
          window.URL.revokeObjectURL(objectUrl);
        }),
        finalize(() => onFinalize?.()),
      );
  }
}
