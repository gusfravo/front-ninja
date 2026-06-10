import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DelegationApiService } from '../../../shared/delegation-api.service';
import { DependenceApiService } from '../../../shared/dependence-api.service';
import { DelegationUpdateInterface, DependenceResponse } from '@shared/interfaces';
import { RouterPathAdmin } from '@shared/enums/router-path-admin.enum';
import { Subject, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-admin-catalog-delegations-update',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './admin-catalog-delegations-update.component.html',
  styleUrl: './admin-catalog-delegations-update.component.scss'
})
export class AdminCatalogDelegationsUpdateComponent {
  @Input() uuid!: string;

  unsubscribe = new Subject<void>();
  dependenceList: DependenceResponse[] = [];

  formGroup = new FormGroup({
    code: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    status: new FormControl(true, [Validators.required]),
    dependenceId: new FormControl('', [Validators.required]),
  });

  constructor(
    private readonly delegationApiService: DelegationApiService,
    private readonly dependenceApiService: DependenceApiService,
    private readonly router: Router,
  ) {}

  ngOnInit() {
    this.dependenceApiService.onList().pipe(
      takeUntil(this.unsubscribe),
      tap(data => { this.dependenceList = data; })
    ).subscribe();

    if (this.uuid !== 'new') {
      this.delegationApiService.onGet(this.uuid).pipe(
        takeUntil(this.unsubscribe),
        tap(data => {
          this.formGroup.setValue({
            code: data.code,
            name: data.name,
            status: data.status,
            dependenceId: data.dependence?.uuid ?? '',
          });
        })
      ).subscribe();
    }
  }

  onSave() {
    if (this.formGroup.invalid) return;

    const payload: DelegationUpdateInterface = {
      ...(this.uuid !== 'new' && { uuid: this.uuid }),
      code: this.formGroup.value.code!,
      name: this.formGroup.value.name!,
      status: this.formGroup.value.status!,
      dependenceId: this.formGroup.value.dependenceId!,
    };

    this.delegationApiService.onSave(payload).pipe(
      takeUntil(this.unsubscribe),
      tap(() => {
        this.router.navigate([RouterPathAdmin.delegations], { replaceUrl: true });
      })
    ).subscribe();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
