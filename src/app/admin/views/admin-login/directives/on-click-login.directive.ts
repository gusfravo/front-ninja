import { Directive, HostListener } from "@angular/core";
import { AdminLoginFormService } from "../services/admin-login-form.service";
import { LoginApiService } from "@shared/services/api/login-api.service";
import { AuthService } from "../../../../core/auth/service/auth.service";
import { SessionService } from "../../../../core/auth/service/session.service";

@Directive({
  selector: '[onClickLogin]',
  standalone: true
})
export class OnClickLoginDirective {

  constructor(private readonly loginFormService: AdminLoginFormService,
    private readonly loginApiService: LoginApiService,
    private readonly authService: AuthService,
    private readonly sessionService: SessionService) { }

  @HostListener('click', ['$event'])
  onclick() {
    const loginData = this.loginFormService.loginSignal();
    this.loginApiService.onLogin(loginData).subscribe(
      data => {
        let fechaActual = new Date();
        fechaActual.setHours(fechaActual.getHours() + 1);
        this.authService.onSetToken(data.token);
        this.sessionService.onSetSession({
          access_token: data.token,
          expires_at: fechaActual.toISOString(),
          roles: [data.role.name],
          token_type: data.tokenType
        });

        console.log(data);
      }
    )
    console.log(loginData);
  }
}
