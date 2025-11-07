import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthInterface } from '../interface/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private _session = new BehaviorSubject<AuthInterface>(this.getClearSessionObject());
  public $session = this._session.asObservable();

  constructor() { }

  public onSetSession(session: AuthInterface): void {
    sessionStorage.setItem('token_type', session.token_type);
    sessionStorage.setItem('expires_at', session.expires_at);
    sessionStorage.setItem('roles', JSON.stringify(session.roles));
    this._session.next(session);

  }

  public onGetSession(): AuthInterface {
    return this._session.value;
  }

  public onReloadSession() {
    if (!!sessionStorage) {
      console.log("HOLA");
    }
    const token_type = !!sessionStorage ? sessionStorage.getItem('token_type') : '';
    const expires_at = !!sessionStorage ? sessionStorage.getItem('expires_at') : '';
    const roles = !!sessionStorage ? JSON.parse(sessionStorage.getItem('roles') || '[]') : '';
    const session: AuthInterface = {
      token_type: token_type ? token_type : '',
      expires_at: expires_at ? expires_at : '',
      roles: roles ? roles : [],
      access_token: '',
    }
    if (session.expires_at != '') {
      this.onSetSession(session);
    }

    return session;
  }


  private getClearSessionObject(): AuthInterface {
    return {
      token_type: '',
      access_token: '',
      roles: [],
      expires_at: ''
    }
  }

  public onDeleteSessionData(): void {
    sessionStorage.clear();
    this._session.complete();
    this._session.unsubscribe();
  }

}
