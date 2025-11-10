import { EventApiService } from '@admin/views/catalogs/shared/event-api.service';
import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EventResponse } from '@shared/interfaces/event.interface';
import { Subject, take, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-admin-catalog-events-workshop',
  imports: [
    RouterLink,
    NgIf
  ],
  templateUrl: './admin-catalog-events-workshop.component.html',
  styleUrl: './admin-catalog-events-workshop.component.scss'
})
export class AdminCatalogEventsWorkshopComponent {
  unsubscribe = new Subject();
  instanceList: EventResponse[] = [];

  constructor(private readonly eventApiService: EventApiService) { }

  ngOnInit() {

    this.eventApiService.onList().pipe(
      takeUntil(this.unsubscribe),
      take(1),
      tap(data => {
        this.instanceList = data;
      })
    ).subscribe()

  }


  ngOnDestroy() {
    this.unsubscribe.next(null)
    this.unsubscribe.complete()
  }
}
