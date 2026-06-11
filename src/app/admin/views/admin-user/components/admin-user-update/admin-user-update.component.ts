import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subject, takeUntil, tap } from 'rxjs';
import { UserApiService } from '../../user-api.service';
import { RoleApiService } from '../../../admin-role/role-api.service';
import { UserUpdateInterface, RoleResponse } from '@shared/interfaces';
import { RouterPathAdmin } from '@shared/enums/router-path-admin.enum';

@Component({
  selector: 'app-admin-user-update',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './admin-user-update.component.html',
  styleUrl: './admin-user-update.component.scss'
})
export class AdminUserUpdateComponent {
  @Input() uuid!: string;

  unsubscribe = new Subject<void>();
  roleList: RoleResponse[] = [];
  isNew = true;

  formGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    fullName: new FormControl('', [Validators.required]),
    password: new FormControl(''),
    status: new FormControl(true, [Validators.required]),
    roleId: new FormControl('', [Validators.required]),
  });

  constructor(
    private readonly userApiService: UserApiService,
    private readonly roleApiService: RoleApiService,
    private readonly router: Router,
  ) {}

  ngOnInit() {
    this.isNew = this.uuid === 'new';

    this.roleApiService.onList().pipe(
      takeUntil(this.unsubscribe),
      tap(data => { this.roleList = data; })
    ).subscribe();

    if (!this.isNew) {
      this.formGroup.get('password')?.clearValidators();
      this.userApiService.onGet(this.uuid).pipe(
        takeUntil(this.unsubscribe),
        tap(data => {
          this.formGroup.patchValue({
            username: data.username,
            fullName: data.full_name,
            status: data.status,
            roleId: data.role?.uuid ?? '',
          });
        })
      ).subscribe();
    } else {
      this.formGroup.get('password')?.setValidators([Validators.required, Validators.minLength(8)]);
    }
    this.formGroup.get('password')?.updateValueAndValidity();
  }

  onSave() {
    if (this.formGroup.invalid) return;

    const payload: UserUpdateInterface = {
      ...(!this.isNew && { uuid: this.uuid }),
      username: this.formGroup.value.username!,
      fullName: this.formGroup.value.fullName!,
      status: this.formGroup.value.status!,
      roleId: this.formGroup.value.roleId!,
      ...(this.formGroup.value.password && { password: this.formGroup.value.password }),
    };

    this.userApiService.onSave(payload).pipe(
      takeUntil(this.unsubscribe),
      tap(() => {
        this.router.navigate([RouterPathAdmin.users], { replaceUrl: true });
      })
    ).subscribe();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
