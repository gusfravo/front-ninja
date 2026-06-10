import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DelegationApiService } from '../shared/delegation-api.service';
import { DelegationResponse } from '@shared/interfaces';
import { Subject, take, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-admin-catalog-delegations',
  imports: [RouterLink],
  templateUrl: './admin-catalog-delegations.component.html',
  styleUrl: './admin-catalog-delegations.component.scss'
})
export class AdminCatalogDelegationsComponent {
  unsubscribe = new Subject<void>();
  instanceList: DelegationResponse[] = [];

  constructor(private readonly delegationApiService: DelegationApiService) {}

  ngOnInit() {
    this.loadList();
  }

  loadList() {
    this.delegationApiService.onList({ dependenceId: null, name: '' }).pipe(
      takeUntil(this.unsubscribe),
      take(1),
      tap(data => { this.instanceList = data; })
    ).subscribe();
  }

  onDelete(uuid: string) {
    this.delegationApiService.onDelete(uuid).pipe(
      takeUntil(this.unsubscribe),
      tap(() => { this.loadList(); })
    ).subscribe();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
