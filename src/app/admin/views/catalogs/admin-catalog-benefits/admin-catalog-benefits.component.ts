import { Component } from '@angular/core';
import { BenefitApiService } from '../shared/benefits-api.service';
import { Subject, take, takeUntil, tap } from 'rxjs';
import { BenefitInterface } from '@shared/interfaces';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-catalog-benefits',
  imports: [
    NgFor,
    NgIf,
    RouterLink
  ],
  templateUrl: './admin-catalog-benefits.component.html',
  styleUrl: './admin-catalog-benefits.component.scss'
})
export class AdminCatalogBenefitsComponent {

  unsubscribe = new Subject();
  instanceList: BenefitInterface[] = [];

  constructor(private readonly benefitApiService: BenefitApiService) { }

  ngOnInit() {

    this.benefitApiService.onList().pipe(
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
