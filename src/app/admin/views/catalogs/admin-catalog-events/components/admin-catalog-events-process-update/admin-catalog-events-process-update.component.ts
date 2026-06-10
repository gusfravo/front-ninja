import { AdminCatalogEventsProcessModalComponent } from '@admin/views/catalogs/shared/components/admin-catalog-events-process-modal/admin-catalog-events-process-modal.component';
import { EventApiService } from '@admin/views/catalogs/shared/event-api.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { EventFileResponse } from '@shared/interfaces';
import { Subject, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-admin-catalog-events-process-update',
  imports: [
    RouterLink,
    DialogModule
  ],
  templateUrl: './admin-catalog-events-process-update.component.html',
  styleUrl: './admin-catalog-events-process-update.component.scss'
})
export class AdminCatalogEventsProcessUpdateComponent implements OnInit, OnDestroy {
  @Input() uuid!: string;
  @Input() eventUuid!: string;

  eventFile: EventFileResponse | null = null;
  loading = false;

  private readonly unsubscribe = new Subject<void>();

  constructor(
    private readonly dialog: Dialog,
    private readonly router: Router,
    private readonly eventApiService: EventApiService,
  ) {}

  ngOnInit() {
  }

  initLoad() {
    if (this.uuid === 'new') {
      this.openModal(true);
      return;
    }

    this.loading = true;
    this.eventApiService.onFindFile({ eventId: this.eventUuid }).pipe(
      takeUntil(this.unsubscribe),
      tap(files => {
        this.loading = false;
        this.eventFile = files.find(f => f.uuid === this.uuid) ?? null;
        this.openModal(true);
      })
    ).subscribe({
      error: () => {
        this.loading = false;
        this.openModal(true);
      }
    });
  }

  openModal(navigateOnCancel = false) {
    const ref = this.dialog.open(AdminCatalogEventsProcessModalComponent, {
      minWidth: '300px',
      data: {
        eventUuid: this.eventUuid,
        uuid: this.uuid !== 'new' ? this.uuid : undefined,
        delegationUuid: this.eventFile?.deletation?.uuid ?? this.eventFile?.delegation?.uuid,
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

  onEdit() {
    this.openModal(false);
  }

  onContinue() {
    // next steps will be added here
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
