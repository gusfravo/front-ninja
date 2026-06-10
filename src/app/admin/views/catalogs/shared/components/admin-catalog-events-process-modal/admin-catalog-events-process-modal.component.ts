import { Component, inject } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DelegationRequestList, DelegationResponse } from '@shared/interfaces';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { DelegationApiService } from '../../delegation-api.service';
import { EventApiService } from '../../event-api.service';

@Component({
  selector: 'app-admin-catalog-events-process-modal',
  imports: [AsyncPipe, FormsModule],
  templateUrl: './admin-catalog-events-process-modal.component.html',
  styleUrl: './admin-catalog-events-process-modal.component.scss'
})
export class AdminCatalogEventsProcessModalComponent {
  private readonly data = inject<{ eventUuid: string; uuid?: string }>(DIALOG_DATA);
  private readonly dialogRef = inject(DialogRef);
  private readonly unsubscribe = new Subject<void>();

  delegationList$!: Observable<DelegationResponse[]>;
  selectedDelegationId = '';
  loading = false;

  private readonly metadata: { listDelegation: DelegationRequestList } = {
    listDelegation: { dependenceId: null, name: '' }
  };

  constructor(
    private readonly delegationApiService: DelegationApiService,
    private readonly eventApiService: EventApiService,
  ) {
    this.delegationList$ = this.delegationApiService.onList(this.metadata.listDelegation);
  }

  get isEdit(): boolean {
    return !!this.data?.uuid;
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    if (!this.selectedDelegationId) return;
    this.loading = true;

    const payload: { eventId: string; delegationId: string; uuid?: string } = {
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
