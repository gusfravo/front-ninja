import { EventApiService } from '@admin/views/catalogs/shared/event-api.service';
import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EventFileResponse } from '@shared/interfaces/event-file.interface';
import { EventMemberAdditionalDataResponse } from '@shared/interfaces/event-member-additional-data.interface';
import { EventMemberResponse } from '@shared/interfaces/event-member.interface';
import { Subject, forkJoin, of, switchMap, takeUntil, tap } from 'rxjs';

interface MemberRow extends EventMemberResponse {
  delegationName: string;
}

@Component({
  selector: 'app-admin-catalog-events-members-general',
  imports: [RouterLink, NgIf, NgFor, FormsModule],
  templateUrl: './admin-catalog-events-members-general.component.html',
  styleUrl: './admin-catalog-events-members-general.component.scss',
})
export class AdminCatalogEventsMembersGeneralComponent implements OnInit, OnDestroy {
  @Input() eventUuid!: string;

  memberList: MemberRow[] = [];
  filterName = '';
  filterUuid = '';

  readonly additionalKeys = ['Documentos', 'INE', 'Carta compromiso'];
  additionalByMember: Record<string, EventMemberAdditionalDataResponse[]> = {};

  private readonly unsubscribe = new Subject<void>();

  constructor(private readonly eventApiService: EventApiService) {}

  ngOnInit() {
    this.loadAll();
  }

  get filteredMemberList(): MemberRow[] {
    const name = this.filterName.trim().toLowerCase();
    const uuid = this.filterUuid.trim().toLowerCase();
    return this.memberList.filter((m) => {
      const matchName = !name || m.full_name?.toLowerCase().includes(name);
      const matchUuid = !uuid || m.uuid.toLowerCase().includes(uuid);
      return matchName && matchUuid;
    });
  }

  getAdditionalState(memberId: string, key: string): EventMemberAdditionalDataResponse | undefined {
    return this.additionalByMember[memberId]?.find((s) => s.key === key);
  }

  saveAdditional(member: MemberRow, key: string, value: boolean) {
    const existing = this.getAdditionalState(member.uuid, key);

    if (!value && existing?.uuid) {
      this.eventApiService.onDeleteEventMemberAdditional(existing.uuid).pipe(
        takeUntil(this.unsubscribe),
        tap(() => {
          this.additionalByMember = {
            ...this.additionalByMember,
            [member.uuid]: (this.additionalByMember[member.uuid] ?? []).filter((s) => s.uuid !== existing.uuid),
          };
        }),
      ).subscribe();
      return;
    }

    if (!value) return;

    this.eventApiService.onSaveEventMemberAdditional({
      uuid: existing?.uuid,
      eventMemberId: member.uuid,
      key,
      value,
    }).pipe(
      takeUntil(this.unsubscribe),
      tap((result) => {
        const list = this.additionalByMember[member.uuid] ?? [];
        const idx = list.findIndex((s) => s.uuid === result.uuid);
        this.additionalByMember = {
          ...this.additionalByMember,
          [member.uuid]: idx !== -1
            ? list.map((s) => (s.uuid === result.uuid ? result : s))
            : [result, ...list],
        };
      }),
    ).subscribe();
  }

  toggleApproved(item: MemberRow) {
    this.eventApiService.onSaveEventMember({
      uuid: item.uuid,
      eventFileId: item.eventFile.uuid,
      memberId: item.member.uuid,
      dependenceId: item.dependence.uuid,
      full_name: item.full_name,
      observations: item.observations,
      approved: !item.approved,
      status: item.status,
    }).pipe(
      takeUntil(this.unsubscribe),
      tap((result) => {
        const idx = this.memberList.findIndex((m) => m.uuid === result.uuid);
        if (idx !== -1) this.memberList[idx] = { ...result, delegationName: this.memberList[idx].delegationName };
      }),
    ).subscribe();
  }

  saveObservations(item: MemberRow, observations: string) {
    if (observations === item.observations) return;
    this.eventApiService.onSaveEventMember({
      uuid: item.uuid,
      eventFileId: item.eventFile.uuid,
      memberId: item.member.uuid,
      dependenceId: item.dependence.uuid,
      full_name: item.full_name,
      observations,
      approved: item.approved,
      status: item.status,
    }).pipe(
      takeUntil(this.unsubscribe),
      tap((result) => {
        const idx = this.memberList.findIndex((m) => m.uuid === result.uuid);
        if (idx !== -1) this.memberList[idx] = { ...result, delegationName: this.memberList[idx].delegationName };
      }),
    ).subscribe();
  }

  deleteMember(uuid: string) {
    const additionals = this.additionalByMember[uuid] ?? [];
    const deleteAdditionals$ = additionals.length
      ? forkJoin(additionals.map((a) => this.eventApiService.onDeleteEventMemberAdditional(a.uuid)))
      : of([]);

    deleteAdditionals$.pipe(
      switchMap(() => this.eventApiService.onDeleteEventMember(uuid)),
      takeUntil(this.unsubscribe),
      tap(() => {
        this.memberList = this.memberList.filter((m) => m.uuid !== uuid);
        const { [uuid]: _, ...rest } = this.additionalByMember;
        this.additionalByMember = rest;
      }),
    ).subscribe();
  }

  private loadAll() {
    this.eventApiService.onFindFile({ eventId: this.eventUuid }).pipe(
      takeUntil(this.unsubscribe),
      tap((files) => {
        if (!files.length) return;

        const requests: Record<string, ReturnType<typeof this.eventApiService.onListEventMembers>> = {};
        files.forEach((f: EventFileResponse) => {
          requests[f.uuid] = this.eventApiService.onListEventMembers(f.uuid);
        });

        forkJoin(requests).pipe(
          takeUntil(this.unsubscribe),
          tap((resultsByFile) => {
            const rows: MemberRow[] = [];
            files.forEach((f) => {
              const delegationName = f.deletation?.name ?? f.delegation?.name ?? '—';
              (resultsByFile[f.uuid] ?? []).forEach((m) => {
                rows.push({ ...m, delegationName });
                this.additionalByMember[m.uuid] = m.additionalStates ?? [];
              });
            });
            this.memberList = rows;
          }),
        ).subscribe();
      }),
    ).subscribe();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
