import { AdminCatalogEventsProcessModalComponent } from '@admin/views/catalogs/shared/components/admin-catalog-events-process-modal/admin-catalog-events-process-modal.component';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Dialog, DIALOG_DATA, DialogModule } from '@angular/cdk/dialog';



@Component({
  selector: 'app-admin-catalog-events-process-update',
  imports: [
    RouterLink,
    AdminCatalogEventsProcessModalComponent,
    DialogModule
  ],
  templateUrl: './admin-catalog-events-process-update.component.html',
  styleUrl: './admin-catalog-events-process-update.component.scss'
})
export class AdminCatalogEventsProcessUpdateComponent {
  @Input() uuid!: string;
  @Input() eventUuid!: string;
  constructor(private readonly dialog: Dialog) { }

  ngOnInit() {
    if (this.uuid == 'new')
      this.initLoad();
  }

  initLoad() {
    this.dialog.open(AdminCatalogEventsProcessModalComponent, {
      minWidth: '300px',
      data: {
        animal: 'panda',
      },
    });
  }

}
