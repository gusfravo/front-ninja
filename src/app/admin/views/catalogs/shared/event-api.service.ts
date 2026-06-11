import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IS_TOKENENABLED } from '@core/auth/context/auth.context';
import { URL } from '@shared/constants/url.constant';
import { ApiNinjaEndpoints } from '@shared/enums/api-ninja-endpoints.enum';
import { EventFileResponse } from '@shared/interfaces';
import { EventExcelFile, EventExcelFileProcess, EventResponse, EventUpdateInterface } from '@shared/interfaces/event.interface';
import { EventMemberAdditionalDataResponse } from '@shared/interfaces/event-member-additional-data.interface';
import { EventMemberResponse } from '@shared/interfaces/event-member.interface';


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

  public onUploadFileExcel(data: EventExcelFile) {
    const formData = new FormData();
    formData.append('file', data.file, Date.now() + '_' + data.file.name.replace(/ /g, "_"));
    formData.append('eventId', data.eventId)
    return this.http.post(URL + ApiNinjaEndpoints.eventUpload, formData, this.secury)
  }

  public onGetSheets(data: { eventId: string }) {
    return this.http.post<string[]>(URL + ApiNinjaEndpoints.eventExcelGetSheets, data, this.secury)
  }

  public onExecuteExcel(data: EventExcelFileProcess) {
    return this.http.post(URL + ApiNinjaEndpoints.eventExcelExecute, data, this.secury)
  }

  public onFindExcel(data: { eventId: string }) {
    return this.http.post(URL + ApiNinjaEndpoints.eventExcelFind, data, this.secury)
  }

  public onFindFile(data: { eventId: string }) {
    return this.http.get<EventFileResponse[]>(URL + ApiNinjaEndpoints.eventGetFileWithDeletations + data.eventId, this.secury)
  }

  public onSaveEventFile(data: { eventId: string; delegationId: string; dependence_name?: string | null; uuid?: string }) {
    return this.http.post<EventFileResponse>(URL + ApiNinjaEndpoints.eventFileUpdate, data, this.secury)
  }

  public onListEventMembers(eventFileId: string) {
    return this.http.get<EventMemberResponse[]>(URL + ApiNinjaEndpoints.eventMemberList + eventFileId, this.secury);
  }

  public onSaveEventMember(data: {
    eventFileId: string;
    memberId: string;
    dependenceId: string;
    full_name: string;
    child_name?: string | null;
    school_level?: string | null;
    observations: string;
    approved: boolean;
    status: boolean;
    uuid?: string;
  }) {
    return this.http.post<EventMemberResponse>(URL + ApiNinjaEndpoints.eventMemberUpdate, data, this.secury);
  }

  public onDeleteEventMember(uuid: string) {
    return this.http.delete<EventMemberResponse>(URL + ApiNinjaEndpoints.eventMemberDelete + uuid, this.secury);
  }

  public onListEventMemberAdditional(eventMemberId: string) {
    return this.http.get<EventMemberAdditionalDataResponse[]>(
      URL + ApiNinjaEndpoints.eventMemberAdditionalList + eventMemberId,
      this.secury,
    );
  }

  public onDeleteEventMemberAdditional(uuid: string) {
    return this.http.delete<void>(
      URL + ApiNinjaEndpoints.eventMemberAdditionalDelete + uuid,
      this.secury,
    );
  }

  public onSaveEventMemberAdditional(data: {
    eventMemberId: string;
    key: string;
    value: boolean;
    uuid?: string;
  }) {
    return this.http.post<EventMemberAdditionalDataResponse>(
      URL + ApiNinjaEndpoints.eventMemberAdditionalUpdate,
      data,
      this.secury,
    );
  }

  public onExportByEvent(eventId: string) {
    return this.http.get(
      URL + ApiNinjaEndpoints.eventMemberExportEvent + eventId,
      { context: new HttpContext().set(IS_TOKENENABLED, true), responseType: 'blob' as const },
    );
  }

  public onExportFormatted(eventFileId: string) {
    return this.http.get(
      URL + ApiNinjaEndpoints.eventMemberExportFormatted + eventFileId,
      { context: new HttpContext().set(IS_TOKENENABLED, true), responseType: 'blob' as const },
    );
  }
}
