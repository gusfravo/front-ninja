import { AdminCatalogEventsProcessModalComponent } from '@admin/views/catalogs/shared/components/admin-catalog-events-process-modal/admin-catalog-events-process-modal.component';
import { DelegationApiService } from '@admin/views/catalogs/shared/delegation-api.service';
import { EventApiService } from '@admin/views/catalogs/shared/event-api.service';
import { MemberApiService } from '@admin/views/catalogs/shared/member-api.service';
import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { DelegationResponse, EventFileResponse } from '@shared/interfaces';
import { EventMemberResponse } from '@shared/interfaces/event-member.interface';
import { MemberResponse } from '@shared/interfaces/member.interface';
import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  takeUntil,
  tap,
  of,
} from 'rxjs';

@Component({
  selector: 'app-admin-catalog-events-process-update',
  imports: [RouterLink, DialogModule, NgIf, NgFor, FormsModule],
  templateUrl: './admin-catalog-events-process-update.component.html',
  styleUrl: './admin-catalog-events-process-update.component.scss',
})
export class AdminCatalogEventsProcessUpdateComponent implements OnInit, OnDestroy {
  @Input() uuid!: string;
  @Input() eventUuid!: string;

  eventFile: EventFileResponse | null = null;
  memberList: EventMemberResponse[] = [];
  delegation: DelegationResponse | null = null;

  searchTerm = '';
  searchResults: MemberResponse[] = [];
  selectedMember: MemberResponse | null = null;
  newObservations = '';
  newApproved = false;

  loadingSearch = false;
  loadingSave = false;
  showDropdown = false;

  private readonly searchInput$ = new Subject<string>();
  private readonly unsubscribe = new Subject<void>();

  constructor(
    private readonly dialog: Dialog,
    private readonly router: Router,
    private readonly eventApiService: EventApiService,
    private readonly memberApiService: MemberApiService,
    private readonly delegationApiService: DelegationApiService,
  ) {}

  ngOnInit() {
    this.initSearch();
    this.loadEventFile();
  }

  private initSearch() {
    this.searchInput$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term) => {
        if (!term || term.length < 2) {
          this.searchResults = [];
          this.showDropdown = false;
          return of([]);
        }
        this.loadingSearch = true;
        return this.memberApiService.listByName(term);
      }),
      takeUntil(this.unsubscribe),
    ).subscribe({
      next: (results) => {
        this.loadingSearch = false;
        this.searchResults = results;
        this.showDropdown = results.length > 0;
      },
      error: () => { this.loadingSearch = false; },
    });
  }

  loadEventFile() {
    this.eventApiService.onFindFile({ eventId: this.eventUuid }).pipe(
      takeUntil(this.unsubscribe),
      tap((files) => {
        this.eventFile = files.find((f) => f.uuid === this.uuid) ?? null;
        if (this.eventFile) {
          this.loadMembers();
          this.loadDelegation();
        }
      }),
    ).subscribe();
  }

  private loadDelegation() {
    const delegationUuid = this.eventFile?.deletation?.uuid ?? this.eventFile?.delegation?.uuid;
    if (!delegationUuid) return;
    this.delegationApiService.onGet(delegationUuid).pipe(
      takeUntil(this.unsubscribe),
      tap((delegation) => { this.delegation = delegation; }),
    ).subscribe();
  }

  private loadMembers() {
    this.eventApiService.onListEventMembers(this.uuid).pipe(
      takeUntil(this.unsubscribe),
      tap((members) => { this.memberList = members; }),
    ).subscribe();
  }

  onSearchInput() {
    this.selectedMember = null;
    this.searchInput$.next(this.searchTerm);
  }

  selectMember(member: MemberResponse) {
    this.selectedMember = member;
    this.searchTerm = member.full_name;
    this.showDropdown = false;
    this.searchResults = [];
    console.log('Selected member:', member);
    console.log("eventFile",this.eventFile);
  }

  addMember() {
    if (!this.selectedMember || !this.eventFile) return;

    const dependenceId = this.delegation?.dependence?.uuid;

    if (!dependenceId) return;

    this.loadingSave = true;
    this.eventApiService.onSaveEventMember({
      eventFileId: this.eventFile.uuid,
      memberId: this.selectedMember.uuid,
      dependenceId,
      full_name: this.selectedMember.full_name,
      observations: this.newObservations,
      approved: this.newApproved,
      status: true,
    }).pipe(
      takeUntil(this.unsubscribe),
      tap((result) => {
        this.loadingSave = false;
        this.memberList = [result, ...this.memberList];
        this.resetForm();
      }),
    ).subscribe({ error: () => { this.loadingSave = false; } });
  }

  toggleApproved(item: EventMemberResponse) {
    this.eventApiService.onSaveEventMember({
      uuid: item.uuid,
      eventFileId: this.uuid,
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
        if (idx !== -1) this.memberList[idx] = result;
      }),
    ).subscribe();
  }

  deleteMember(uuid: string) {
    this.eventApiService.onDeleteEventMember(uuid).pipe(
      takeUntil(this.unsubscribe),
      tap(() => {
        this.memberList = this.memberList.filter((m) => m.uuid !== uuid);
      }),
    ).subscribe();
  }

  private resetForm() {
    this.searchTerm = '';
    this.selectedMember = null;
    this.newObservations = '';
    this.newApproved = false;
    this.searchResults = [];
    this.showDropdown = false;
  }

  openModal(navigateOnCancel = false) {
    const ref = this.dialog.open(AdminCatalogEventsProcessModalComponent, {
      minWidth: '300px',
      data: {
        eventUuid: this.eventUuid,
        uuid: this.uuid !== 'new' ? this.uuid : undefined,
        delegationUuid: this.delegation?.uuid,
      },
    });

    ref.closed.pipe(takeUntil(this.unsubscribe)).subscribe((result) => {
      if (result) {
        this.eventFile = result as EventFileResponse;
      } else if (navigateOnCancel) {
        this.router.navigate(['/admin/platform/catalog/events/workshop/process', this.eventUuid]);
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
