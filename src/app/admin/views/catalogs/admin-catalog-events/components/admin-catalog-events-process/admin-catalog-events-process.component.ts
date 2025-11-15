import { EventApiService } from '@admin/views/catalogs/shared/event-api.service';
import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EventFileResponse } from '@shared/interfaces';
import { Subject, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-admin-catalog-events-process',
  imports: [
    RouterLink,
    NgIf
  ],
  templateUrl: './admin-catalog-events-process.component.html',
  styleUrl: './admin-catalog-events-process.component.scss'
})
export class AdminCatalogEventsProcessComponent {
  unsubscribe = new Subject();
  instanceList: EventFileResponse[] = [];
  @Input() uuid!: string;

  constructor(private readonly eventApiService: EventApiService) { }

  ngOnInit() {
    this.eventApiService.onFindFile({ eventId: this.uuid }).pipe(
      takeUntil(this.unsubscribe),
      tap(data => {
        this.instanceList = data;
        console.log(this.instanceList);
      })
    ).subscribe()
  }
}
