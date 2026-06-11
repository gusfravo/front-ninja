import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, takeUntil, tap } from 'rxjs';
import { CapturerLoginFormService } from '../../services/capturer-login-form.service';
import { Login } from '@shared/models/login.constant';

@Component({
  selector: 'app-capturer-login-form',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './capturer-login-form.component.html',
  styleUrl: './capturer-login-form.component.scss',
  standalone: true
})
export class CapturerLoginFormComponent implements OnDestroy {

  public loginFormGroup: FormGroup = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });
  unsubscribe = new Subject<void>();

  constructor(private readonly capturerLoginService: CapturerLoginFormService) {
    this.loginFormGroup.valueChanges.pipe(
      takeUntil(this.unsubscribe),
      debounceTime(400),
      distinctUntilChanged(),
      tap(data => {
        let object = structuredClone(Login);
        object.username = data.username;
        object.password = data.password;
        this.capturerLoginService.onUpdate(object);
      })
    ).subscribe();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
