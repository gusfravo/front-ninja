import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IS_TOKENENABLED } from '../context/auth.context';
import { AuthService } from '../service/auth.service';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class AuthInterceptor implements HttpInterceptor {

  constructor(private readonly _authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("AuthInterceptor", req.context.get(IS_TOKENENABLED))
    let authReq = req;
    if (req.context.get(IS_TOKENENABLED)) {
      const token = this._authService.onGetToken();
      // Clona la solicitud para agregar el nuevo header.
      authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
    }
    // Pasa la solicitud clonada en lugar de la original.
    return next.handle(authReq);
  }
}
