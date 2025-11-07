import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private readonly router: Router,
    private readonly _authService: AuthService
  ) { }

  canActivate(): Observable<boolean> {
    return this._authService.isAuthenticated().pipe(
      tap((isAuthOk) => {
        console.log(":::: isAuthenticated :::: ", isAuthOk)
        if (!isAuthOk)
          this.router.navigate(['/']);
      })
    )
  }


}
