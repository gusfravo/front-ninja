import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EventInterface, EventResponse } from '@shared/interfaces/event.interface';
import { Subject, take, takeUntil, tap } from 'rxjs';
import { EventApiService } from '../shared/event-api.service';

@Component({
  selector: 'app-admin-catalog-events',
  imports: [
    NgIf,
    RouterLink
  ],
  templateUrl: './admin-catalog-events.component.html',
  styleUrl: './admin-catalog-events.component.scss'
})
export class AdminCatalogEventsComponent {
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
