import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subject, takeUntil, tap } from 'rxjs';
import { RoleApiService } from '../../role-api.service';
import { RoleUpdateInterface } from '@shared/interfaces';
import { RouterPathAdmin } from '@shared/enums/router-path-admin.enum';

@Component({
  selector: 'app-admin-role-update',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './admin-role-update.component.html',
  styleUrl: './admin-role-update.component.scss'
})
export class AdminRoleUpdateComponent {
  @Input() uuid!: string;

  unsubscribe = new Subject<void>();

  formGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    description: new FormControl('', [Validators.required]),
    status: new FormControl(true, [Validators.required]),
  });

  constructor(
    private readonly roleApiService: RoleApiService,
    private readonly router: Router,
  ) {}

  ngOnInit() {
    if (this.uuid !== 'new') {
      this.roleApiService.onGet(this.uuid).pipe(
        takeUntil(this.unsubscribe),
        tap(data => {
          this.formGroup.setValue({
            name: data.name,
            description: data.description,
            status: data.status,
          });
        })
      ).subscribe();
    }
  }

  onSave() {
    if (this.formGroup.invalid) return;

    const payload: RoleUpdateInterface = {
      ...(this.uuid !== 'new' && { uuid: this.uuid }),
      name: this.formGroup.value.name!,
      description: this.formGroup.value.description!,
      status: this.formGroup.value.status!,
    };

    this.roleApiService.onSave(payload).pipe(
      takeUntil(this.unsubscribe),
      tap(() => {
        this.router.navigate([RouterPathAdmin.roles], { replaceUrl: true });
      })
    ).subscribe();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
