import { Component, inject } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DependenceApiService } from '../../dependence-api.service';
import { DelegationApiService } from '../../delegation-api.service';
import { DelegationUpdateInterface, DependenceResponse } from '@shared/interfaces';
import { Subject, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-admin-catalog-delegations-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-catalog-delegations-modal.component.html',
  styleUrl: './admin-catalog-delegations-modal.component.scss'
})
export class AdminCatalogDelegationsModalComponent {
  private readonly dialogRef = inject(DialogRef);
  private readonly unsubscribe = new Subject<void>();

  dependenceList: DependenceResponse[] = [];
  loading = false;

  formGroup = new FormGroup({
    code: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    dependenceId: new FormControl('', [Validators.required]),
  });

  constructor(
    private readonly dependenceApiService: DependenceApiService,
    private readonly delegationApiService: DelegationApiService,
  ) {}

  ngOnInit() {
    this.dependenceApiService.onList().pipe(
      takeUntil(this.unsubscribe),
      tap(data => { this.dependenceList = data; })
    ).subscribe();
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    if (this.formGroup.invalid) return;
    this.loading = true;

    const payload: DelegationUpdateInterface = {
      code: this.formGroup.value.code!,
      name: this.formGroup.value.name!,
      status: true,
      dependenceId: this.formGroup.value.dependenceId!,
    };

    this.delegationApiService.onSave(payload).pipe(
      takeUntil(this.unsubscribe),
      tap((result) => {
        this.loading = false;
        this.dialogRef.close(result);
      })
    ).subscribe({
      error: () => { this.loading = false; }
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
