import { AdminCatalogEventsProcessModalComponent } from '@admin/views/catalogs/shared/components/admin-catalog-events-process-modal/admin-catalog-events-process-modal.component';
import { Component, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Dialog, DialogModule } from '@angular/cdk/dialog';

@Component({
  selector: 'app-admin-catalog-events-process-update',
  imports: [
    RouterLink,
    DialogModule
  ],
  templateUrl: './admin-catalog-events-process-update.component.html',
  styleUrl: './admin-catalog-events-process-update.component.scss'
})
export class AdminCatalogEventsProcessUpdateComponent {
  @Input() uuid!: string;
  @Input() eventUuid!: string;

  constructor(
    private readonly dialog: Dialog,
    private readonly router: Router,
  ) {}

  ngOnInit() {
    this.initLoad();
  }

  initLoad() {
    const ref = this.dialog.open(AdminCatalogEventsProcessModalComponent, {
      minWidth: '300px',
      data: {
        eventUuid: this.eventUuid,
        uuid: this.uuid !== 'new' ? this.uuid : undefined,
      },
    });

    ref.closed.subscribe((result) => {
      if (result) {
        this.router.navigate(['/admin/platform/catalog/events/workshop/process', this.eventUuid]);
      } else {
        this.router.navigate(['/admin/platform/catalog/events/workshop/process', this.eventUuid]);
      }
    });
  }
}
