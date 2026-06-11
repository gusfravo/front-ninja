import { NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EventApiService } from '@admin/views/catalogs/shared/event-api.service';
import { EventResponse } from '@shared/interfaces/event.interface';
import { Subject, finalize, take, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-capturer-dashboard',
  imports: [NgIf, RouterLink],
  templateUrl: './capturer-dashboard.component.html',
  styleUrl: './capturer-dashboard.component.scss',
  standalone: true
})
export class CapturerDashboardComponent implements OnInit, OnDestroy {
  unsubscribe = new Subject<void>();
  instanceList: EventResponse[] = [];
  downloadingEventId: string | null = null;

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

  downloadExcel(event: EventResponse) {
    if (this.downloadingEventId) return;
    this.downloadingEventId = event.uuid;

    this.eventApiService.onExportByEvent(event.uuid).pipe(
      take(1),
      tap((blob) => {
        const url = window.URL.createObjectURL(blob as Blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `agremiados-${event.benefit?.name ?? event.uuid}.xlsx`;
        anchor.click();
        window.URL.revokeObjectURL(url);
      }),
      finalize(() => { this.downloadingEventId = null; }),
    ).subscribe({ error: () => { this.downloadingEventId = null; } });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
