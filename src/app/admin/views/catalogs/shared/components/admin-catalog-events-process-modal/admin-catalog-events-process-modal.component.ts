import { Component } from '@angular/core';
import { DelegationRequestList, DelegationResponse } from '@shared/interfaces';
import { Observable } from 'rxjs';
import { DelegationApiService } from '../../delegation-api.service';

@Component({
  selector: 'app-admin-catalog-events-process-modal',
  imports: [],
  templateUrl: './admin-catalog-events-process-modal.component.html',
  styleUrl: './admin-catalog-events-process-modal.component.scss'
})
export class AdminCatalogEventsProcessModalComponent {

  $delegationList!: Observable<DelegationResponse[]>
  metadata: { listDelegation: DelegationRequestList } = {
    listDelegation: {
      dependenceId: null,
      name: ''
    }
  }

  constructor(private readonly delegationApiService: DelegationApiService) {
    this.$delegationList = this.delegationApiService.onList(this.metadata.listDelegation);
  }



}
