import { Directive, HostListener } from "@angular/core";
import { AdminLoginFormService } from "../services/admin-login-form.service";

@Directive({
  selector: '[onClickLogin]',
  standalone: true
})
export class OnClickLoginDirective {

  constructor(private readonly loginFormService: AdminLoginFormService) { }

  @HostListener('click', ['$event'])
  onclick() {
    const loginData = this.loginFormService.loginSignal();
    console.log(loginData);
  }
}
