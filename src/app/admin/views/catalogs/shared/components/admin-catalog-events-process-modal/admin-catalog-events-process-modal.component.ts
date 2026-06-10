import { Component, inject } from '@angular/core';
import { DIALOG_DATA, Dialog, DialogRef, DialogModule } from '@angular/cdk/dialog';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DelegationRequestList, DelegationResponse } from '@shared/interfaces';
import { Subject, takeUntil, tap } from 'rxjs';
import { DelegationApiService } from '../../delegation-api.service';
import { EventApiService } from '../../event-api.service';
import { AdminCatalogDelegationsModalComponent } from '../admin-catalog-delegations-modal/admin-catalog-delegations-modal.component';

@Component({
  selector: 'app-admin-catalog-events-process-modal',
  imports: [AsyncPipe, FormsModule, DialogModule],
  templateUrl: './admin-catalog-events-process-modal.component.html',
  styleUrl: './admin-catalog-events-process-modal.component.scss'
})
export class AdminCatalogEventsProcessModalComponent {
  private readonly data = inject<{ eventUuid: string; uuid?: string }>(DIALOG_DATA);
  private readonly dialogRef = inject(DialogRef);
  private readonly dialog = inject(Dialog);
  private readonly unsubscribe = new Subject<void>();

  delegationList: DelegationResponse[] = [];
  selectedDelegationId = '';
  loading = false;

  private readonly listFilter: DelegationRequestList = { dependenceId: null, name: '' };

  constructor(
    private readonly delegationApiService: DelegationApiService,
    private readonly eventApiService: EventApiService,
  ) {}

  ngOnInit() {
    this.loadDelegations();
  }

  get isEdit(): boolean {
    return !!this.data?.uuid;
  }

  loadDelegations() {
    this.delegationApiService.onList(this.listFilter).pipe(
      takeUntil(this.unsubscribe),
      tap(data => { this.delegationList = data; })
    ).subscribe();
  }

  openCreateDelegation() {
    const ref = this.dialog.open(AdminCatalogDelegationsModalComponent, {
      minWidth: '380px',
    });

    ref.closed.pipe(takeUntil(this.unsubscribe)).subscribe((result) => {
      if (result) {
        this.loadDelegations();
        this.selectedDelegationId = (result as DelegationResponse).uuid;
      }
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    if (!this.selectedDelegationId) return;
    this.loading = true;

    const payload: { eventId: string; delegationId: string; uuid?: string } = {
      uuid:'',
      eventId: this.data.eventUuid,
      delegationId: this.selectedDelegationId,
    };

    if (this.isEdit) payload['uuid'] = this.data.uuid;

    this.eventApiService.onSaveEventFile(payload).pipe(
      takeUntil(this.unsubscribe),
      tap((result) => {
        this.loading = false;
        this.dialogRef.close(result);
      })
    ).subscribe({
      error: () => { this.loading = false; }
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
