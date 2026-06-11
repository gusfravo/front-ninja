import { Directive, HostListener } from '@angular/core';
import { CapturerLoginFormService } from '../services/capturer-login-form.service';
import { LoginApiService } from '@shared/services/api/login-api.service';
import { AuthService } from '@core/auth/service/auth.service';
import { SessionService } from '@core/auth/service/session.service';
import { Router } from '@angular/router';

@Directive({
  selector: '[onClickCapturerLogin]',
  standalone: true
})
export class OnClickCapturerLoginDirective {

  constructor(
    private readonly loginFormService: CapturerLoginFormService,
    private readonly loginApiService: LoginApiService,
    private readonly authService: AuthService,
    private readonly sessionService: SessionService,
    private readonly router: Router
  ) { }

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
        this.router.navigate(['/capturer/platform/dashboard'], { replaceUrl: true });
      }
    );
  }
}
