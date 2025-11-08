import { BenefitApiService } from '@admin/views/catalogs/shared/benefits-api.service';
import { EventApiService } from '@admin/views/catalogs/shared/event-api.service';
import { AsyncPipe, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RouterPathAdmin } from '@shared/enums/router-path-admin.enum';
import { BenefitInterface } from '@shared/interfaces';
import { EventInterface, EventResponse } from '@shared/interfaces/event.interface';
import { debounceTime, distinctUntilChanged, Observable, Subject, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-admin-catalog-events-update',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    NgIf,
    AsyncPipe
  ],
  templateUrl: './admin-catalog-events-update.component.html',
  styleUrl: './admin-catalog-events-update.component.scss'
})
export class AdminCatalogEventsUpdateComponent {

  statusList = [
    'Iniciado',
    'Proceso',
    'Cancelado'
  ]

  object: EventInterface = {
    uuid: '',
    status: 'Iniciado',
    benefitId: '',
    start_date: new Date(),
    end_date: new Date(),
  }

  formGroup: FormGroup = new FormGroup({
    status: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    benefitId: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ])

  });

  @Input() uuid!: string;

  unsubscribe = new Subject();
  benefits$: Observable<BenefitInterface[]>;

  constructor(
    private readonly eventApiService: EventApiService,
    private readonly router: Router,
    private readonly benefitApiService: BenefitApiService
  ) {
    this.benefits$ = this.benefitApiService.onList();
    this.formGroup.valueChanges.pipe(
      takeUntil(this.unsubscribe),
      debounceTime(400),
      distinctUntilChanged(),
      tap(data => {
        this.object.benefitId = data.benefitId,
          this.object.status = data.status;
      })
    ).subscribe()
  }

  ngOnInit() {
    if (this.uuid != 'new') {
      this.eventApiService.onGet(this.uuid).pipe(
        takeUntil(this.unsubscribe),
        tap(data => {
          this.object.uuid = data.uuid;
          this.object.benefitId = data.benefit.uuid;
          this.object.start_date = new Date(data.start_date);
          this.object.end_date = new Date(data.end_date);
          this.object.status = data.status;
          this.formGroup.setValue({
            'status': this.object.status,
            'benefitId': data.benefit.uuid
          })
        })
      ).subscribe()
    }
  }

  onUpdate() {
    return this.eventApiService.onSave({
      ...this.object,
      startDate: this.object.start_date.toISOString().substring(0, 10),
      endDate: this.object.end_date.toISOString().substring(0, 10)
    }).pipe(
      takeUntil(this.unsubscribe),
      debounceTime(400),
      distinctUntilChanged(),
      tap(_ => {
        const { events } = RouterPathAdmin;
        this.router.navigate([events], { replaceUrl: true })
      })
    ).subscribe()
  }

  ngOnDestroy() {
    this.unsubscribe.next(null)
    this.unsubscribe.complete()
  }

}
