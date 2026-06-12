import { AdminCatalogEventsProcessModalComponent } from '@admin/views/catalogs/shared/components/admin-catalog-events-process-modal/admin-catalog-events-process-modal.component';
import { EventApiService } from '@admin/views/catalogs/shared/event-api.service';
import { EventMemberExcelApiService } from '@admin/views/catalogs/shared/event-member-excel-api.service';
import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { EventFileResponse } from '@shared/interfaces';
import { Subject, finalize, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-admin-catalog-events-process',
  imports: [
    RouterLink,
    NgIf,
    DialogModule
  ],
  templateUrl: './admin-catalog-events-process.component.html',
  styleUrl: './admin-catalog-events-process.component.scss'
})
export class AdminCatalogEventsProcessComponent {
  unsubscribe = new Subject();
  instanceList: EventFileResponse[] = [];
  downloadingFormatId: string | null = null;
  @Input() uuid!: string;

  constructor(
    private readonly eventApiService: EventApiService,
    private readonly eventMemberExcelApiService: EventMemberExcelApiService,
    private readonly dialog: Dialog,
  ) { }

  ngOnInit() {
    this.eventApiService.onFindFile({ eventId: this.uuid }).pipe(
      takeUntil(this.unsubscribe),
      tap(data => {
        this.instanceList = data;
      })
    ).subscribe()
  }

  openNewModal() {
    const ref = this.dialog.open(AdminCatalogEventsProcessModalComponent, {
      minWidth: '300px',
      data: { eventUuid: this.uuid },
    });

    ref.closed.pipe(takeUntil(this.unsubscribe)).subscribe((result) => {
      if (result) this.instanceList = [result as EventFileResponse, ...this.instanceList];
    });
  }

  openEditModal(item: EventFileResponse) {
    const ref = this.dialog.open(AdminCatalogEventsProcessModalComponent, {
      minWidth: '300px',
      data: {
        eventUuid: this.uuid,
        uuid: item.uuid,
        delegationUuid: item.deletation?.uuid ?? (item as any).delegation?.uuid,
      },
    });

    ref.closed.pipe(takeUntil(this.unsubscribe)).subscribe((result) => {
      if (result) {
        const updated = result as EventFileResponse;
        const idx = this.instanceList.findIndex(f => f.uuid === updated.uuid);
        if (idx !== -1) this.instanceList[idx] = updated;
      }
    });
  }

  exportGeneralExcel() {
    this.eventMemberExcelApiService.downloadByEvent(this.uuid).pipe(
      takeUntil(this.unsubscribe),
    ).subscribe();
  }

  exportFormatExcel(item: EventFileResponse) {
    if (this.downloadingFormatId) return;
    this.downloadingFormatId = item.uuid;
    const delegationName = item.deletation?.name ?? item.uuid;
    this.eventApiService.onExportFormatted(item.uuid).pipe(
      takeUntil(this.unsubscribe),
      tap((blob) => {
        const url = window.URL.createObjectURL(blob as Blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `formato-utiles-${delegationName}.xlsx`;
        anchor.click();
        window.URL.revokeObjectURL(url);
      }),
      finalize(() => { this.downloadingFormatId = null; }),
    ).subscribe({ error: () => { this.downloadingFormatId = null; } });
  }

  exportExcel(item: EventFileResponse) {
    const delegationName = item.deletation?.name ?? (item as any).delegation?.name ?? 'export';
    this.eventMemberExcelApiService.downloadByEventFile(item.uuid, delegationName).pipe(
      takeUntil(this.unsubscribe),
    ).subscribe();
  }

  ngOnDestroy() {
    this.unsubscribe.next(null);
    this.unsubscribe.complete();
  }
}
