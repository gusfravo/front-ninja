import { Component } from '@angular/core';
import { EventResponse } from '@shared/interfaces/event.interface';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-admin-catalog-events-process',
  imports: [
    RouterLink,
    NgIf
  ],
  templateUrl: './admin-catalog-events-process.component.html',
  styleUrl: './admin-catalog-events-process.component.scss'
}
export class AdminCatalogEventsProcessComponent {
  unsubscribe = new Subject();
  instanceList: EventFileResponse[] = [];
}
