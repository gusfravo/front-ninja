import { Directive, HostListener } from "@angular/core";
import { AdminLoginFormService } from "../services/admin-login-form.service";
import { LoginApiService } from "@shared/services/api/login-api.service";

@Directive({
  selector: '[onClickLogin]',
  standalone: true
})
export class OnClickLoginDirective {

  constructor(private readonly loginFormService: AdminLoginFormService,
    private readonly loginApiService: LoginApiService) { }

  @HostListener('click', ['$event'])
  onclick() {
    const loginData = this.loginFormService.loginSignal();
    this.loginApiService.onLogin(loginData).subscribe(
      data => {
        console.log(data);
      }
    )
    console.log(loginData);
  }
}
