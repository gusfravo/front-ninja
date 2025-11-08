import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BenefitInterface } from '@shared/interfaces';
import { BenefitApiService } from '../../shared/benefits-api.service';
import { debounceTime, distinctUntilChanged, Subject, takeUntil, tap } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { RouterPathAdmin } from '@shared/enums/router-path-admin.enum';

@Component({
  selector: 'app-admin-catalog-benefits-update',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './admin-catalog-benefits-update.component.html',
  styleUrl: './admin-catalog-benefits-update.component.scss'
})
export class AdminCatalogBenefitsUpdateComponent {

  object: BenefitInterface = {
    uuid: '',
    name: '',
    status: true,
    created_at: '',
    updated_at: ''
  }

  formGroup: FormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ])
  });

  @Input() uuid!: string;

  unsubscribe = new Subject();

  constructor(
    private readonly benefitApiService: BenefitApiService,
    private readonly router: Router
  ) {
    this.formGroup.valueChanges.pipe(
      takeUntil(this.unsubscribe),
      debounceTime(400),
      distinctUntilChanged(),
      tap(data => {
        this.object.name = data.name;
      })
    ).subscribe()
  }

  ngOnInit() {
    if (this.uuid != 'new') {
      console.log(this.uuid);
      this.benefitApiService.onGet(this.uuid).pipe(
        takeUntil(this.unsubscribe),
        tap(data => {
          this.object = data;
          this.formGroup.setValue({
            'name': this.object.name
          })
        })
      ).subscribe()
    }
  }

  onUpdate() {
    return this.benefitApiService.onSave(this.object).pipe(
      takeUntil(this.unsubscribe),
      debounceTime(400),
      distinctUntilChanged(),
      tap(data => {
        const { benefits } = RouterPathAdmin;
        this.router.navigate([benefits], { replaceUrl: true })
      })
    ).subscribe()
  }

  ngOnDestroy() {
    this.unsubscribe.next(null)
    this.unsubscribe.complete()
  }


}
