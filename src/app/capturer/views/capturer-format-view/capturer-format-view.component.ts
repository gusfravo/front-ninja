import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-capturer-format-view',
  imports: [RouterLink],
  templateUrl: './capturer-format-view.component.html',
  styleUrl: './capturer-format-view.component.scss',
  standalone: true
})
export class CapturerFormatViewComponent {
  eventId: string = '';
  rows = Array.from({ length: 17 }, (_, i) => i + 1);

  constructor(private readonly route: ActivatedRoute) {
    this.eventId = this.route.snapshot.paramMap.get('id') ?? '';
  }
}
