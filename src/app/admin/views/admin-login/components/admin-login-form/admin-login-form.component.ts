import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { debounceTime, distinctUntilChanged, Subject, takeUntil, tap } from 'rxjs';
import { AdminLoginFormService } from '../../services/admin-login-form.service';
import { Login } from '@shared/models/login.constant';

@Component({
  selector: 'app-admin-login-form',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './admin-login-form.component.html',
  styleUrl: './admin-login-form.component.scss'
})
export class AdminLoginFormComponent {

  public loginFormGroup: FormGroup = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });;
  unsubscribe = new Subject();

  constructor(private adminLoginService: AdminLoginFormService) {

    this.loginFormGroup.valueChanges.pipe(
      takeUntil(this.unsubscribe),
      debounceTime(400),
      distinctUntilChanged(),
      tap(data => {
        let object = structuredClone(Login);
        object.username = data.username;
        object.password = data.password;
        this.adminLoginService.onUpdate(object);
      })
    ).subscribe()
  }


  ngOnDestroy() {
    this.unsubscribe.next(null)
    this.unsubscribe.complete()
  }

}
