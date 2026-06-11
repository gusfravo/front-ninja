import { NgFor, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { DependenceApiService } from '../../dependence-api.service';
import { DelegationApiService } from '../../delegation-api.service';
import { MemberApiService } from '../../member-api.service';
import { DelegationUpdateInterface, DependenceResponse } from '@shared/interfaces';
import { MemberResponse } from '@shared/interfaces/member.interface';
import { Subject, debounceTime, distinctUntilChanged, of, switchMap, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-admin-catalog-delegations-modal',
  imports: [ReactiveFormsModule, FormsModule, NgIf, NgFor],
  templateUrl: './admin-catalog-delegations-modal.component.html',
  styleUrl: './admin-catalog-delegations-modal.component.scss'
})
export class AdminCatalogDelegationsModalComponent implements OnInit, OnDestroy {
  private readonly dialogRef = inject(DialogRef);
  private readonly unsubscribe = new Subject<void>();

  dependenceList: DependenceResponse[] = [];
  loading = false;

  formGroup = new FormGroup({
    code: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    dependenceId: new FormControl('', [Validators.required]),
  });

  // Búsqueda de titular
  memberSearchTerm = '';
  memberResults: MemberResponse[] = [];
  selectedMember: MemberResponse | null = null;
  showMemberDropdown = false;
  loadingMemberSearch = false;

  private readonly memberSearch$ = new Subject<string>();

  constructor(
    private readonly dependenceApiService: DependenceApiService,
    private readonly delegationApiService: DelegationApiService,
    private readonly memberApiService: MemberApiService,
  ) {}

  ngOnInit() {
    this.dependenceApiService.onList().pipe(
      takeUntil(this.unsubscribe),
      tap(data => { this.dependenceList = data; })
    ).subscribe();

    this.memberSearch$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term) => {
        if (!term || term.length < 2) {
          this.memberResults = [];
          this.showMemberDropdown = false;
          return of([]);
        }
        this.loadingMemberSearch = true;
        return this.memberApiService.listByName(term);
      }),
      takeUntil(this.unsubscribe),
    ).subscribe({
      next: (results) => {
        this.loadingMemberSearch = false;
        this.memberResults = results;
        this.showMemberDropdown = results.length > 0;
      },
      error: () => { this.loadingMemberSearch = false; },
    });
  }

  onMemberSearchInput() {
    this.selectedMember = null;
    this.memberSearch$.next(this.memberSearchTerm);
  }

  selectMember(member: MemberResponse) {
    this.selectedMember = member;
    this.memberSearchTerm = member.full_name;
    this.showMemberDropdown = false;
    this.memberResults = [];
  }

  clearMember() {
    this.selectedMember = null;
    this.memberSearchTerm = '';
  }

  hideMemberDropdown() {
    setTimeout(() => { this.showMemberDropdown = false; }, 200);
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
      ...(this.selectedMember ? { titularId: this.selectedMember.uuid } : {}),
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
