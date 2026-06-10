import { AdminCatalogEventsProcessModalComponent } from '@admin/views/catalogs/shared/components/admin-catalog-events-process-modal/admin-catalog-events-process-modal.component';
import { EventApiService } from '@admin/views/catalogs/shared/event-api.service';
import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { EventFileResponse } from '@shared/interfaces';
import { Subject, takeUntil, tap } from 'rxjs';

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
  @Input() uuid!: string;

  constructor(
    private readonly eventApiService: EventApiService,
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

  ngOnDestroy() {
    this.unsubscribe.next(null);
    this.unsubscribe.complete();
  }
}
