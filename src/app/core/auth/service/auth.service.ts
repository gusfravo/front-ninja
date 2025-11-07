import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, of, switchMap } from 'rxjs';
import { SessionService } from './session.service';
import { AuthInterface } from '../interface/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private readonly cookieService: CookieService,
    private readonly _sessionService: SessionService
  ) { }

  onSetToken(token: string): void {
    this.cookieService.set('authToken', token, 1, '/', 'localhost', true, 'Strict',);
  }

  onGetToken(): string {
    return this.cookieService.get('authToken');
  }

  isLoggedIn(): boolean {
    return !!this.onGetToken();
  }

  onLogout(): boolean {
    this._sessionService.onDeleteSessionData();
    this.cookieService.delete('authToken', '/');
    return true
  }

  isAuthenticated(): Observable<boolean> {
    return this._sessionService.$session.pipe(
      switchMap(session => {
        let isAuthenticated: boolean = false;
        if (session.expires_at) {
          if (this.isLoggedIn()) {
            //verificamos si esta expirada la session
            isAuthenticated = this.onCheckExpiredSession(session);
          } else {
            isAuthenticated = false
          }
        } else {
          const sessionRecovered = this._sessionService.onReloadSession();
          console.log("sessionRecovered", sessionRecovered)
          isAuthenticated = this.onCheckExpiredSession(sessionRecovered);
        }
        return of(isAuthenticated)

      })
    )

    // return of(this.isLoggedIn())
  }

  private onCheckExpiredSession(session: AuthInterface): boolean {
    let isAuthenticated = false;
    const expiredDateMs = new Date(session.expires_at).getTime();
    const nowMs = new Date().getTime();
    const isExpired: boolean = expiredDateMs - nowMs > 0;
    isAuthenticated = isExpired;
    return isAuthenticated;
  }

}
