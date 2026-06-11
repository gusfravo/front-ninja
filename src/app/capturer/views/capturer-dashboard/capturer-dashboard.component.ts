import { NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { EventApiService } from '@admin/views/catalogs/shared/event-api.service';
import { EventResponse } from '@shared/interfaces/event.interface';
import { Subject, take, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-capturer-dashboard',
  imports: [NgIf],
  templateUrl: './capturer-dashboard.component.html',
  styleUrl: './capturer-dashboard.component.scss',
  standalone: true
})
export class CapturerDashboardComponent implements OnInit, OnDestroy {
  unsubscribe = new Subject<void>();
  instanceList: EventResponse[] = [];

  constructor(private readonly eventApiService: EventApiService) { }

  ngOnInit() {
    this.eventApiService.onList().pipe(
      takeUntil(this.unsubscribe),
      take(1),
      tap(data => {
        this.instanceList = data;
      })
    ).subscribe();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
