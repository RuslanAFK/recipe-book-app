import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import * as AuthActions from "./auth.actions";
import { environment } from 'src/environments/environment';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "../user.model";
import { AuthService } from "../auth.service";

interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered? : boolean;
}

const handleAuth = (data: AuthResponseData) => {
  const expirationDate = new Date(new Date().getTime() + +data.expiresIn * 1000);
  const user = new User(data.email, data.localId, data.idToken, expirationDate);
  localStorage.setItem('userData', JSON.stringify(user));
  return AuthActions.authSuccess({
    payload: {
      email: data.email, userId: data.localId, token: data.idToken, expirationDate: expirationDate, redirect: true,
    }
  })
}



const handleError = (errorRes: any) => {
  let errorMessage = 'An unknown error occured.';
  if(!errorRes.error || !errorRes.error.error){
    return of(AuthActions.authFailure({payload: {error: errorMessage}}));
  }
  return of(AuthActions.authFailure({payload: {error: "Error: "+errorRes.error.error.message}}));
}


@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ){}

  API_KEY = environment.fireBaseApiKey;

  signupEffect  = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.signupStart),
    switchMap((action) => {
      return this.http
      .post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key='
        +this.API_KEY,
      {
        email: action.payload.email,
        password: action.payload.password,
        returnSecureToken: true
      })
      .pipe(
        tap(resData => {
          this.authService.setLogoutTimer(+resData.expiresIn * 1000);
        }),
        map(data => handleAuth(data)),
        catchError(errorRes => handleError(errorRes))
        )
      ;
    })
  ))

  loginEffect  = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.loginStart),
    switchMap((action) => {
      return this.http
      .post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='
        +this.API_KEY,
      {
        email: action.payload.email,
        password: action.payload.password,
        returnSecureToken: true
      })
      .pipe(
        tap(resData => {
          this.authService.setLogoutTimer(+resData.expiresIn * 1000);
        }),
        map(data => handleAuth(data)),
        catchError(errorRes => handleError(errorRes))
        )
      ;
    })
  ))

  authRedirect = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.authSuccess),
    tap((action) => {
      if(action.payload.redirect) {
        this.router.navigate(['/']);
      }
    }),
  ), {dispatch: false})

  authLogout = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.logout),
    tap(() => {
      this.authService.clearLogoutTimer();
      localStorage.removeItem('userData');
      this.router.navigate(['/auth']);
    })
  ), {dispatch: false})

  autoLogin = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.autoLogin),
    map(() => {
      const rawUserData = localStorage.getItem('userData');
    if(!rawUserData) {
      return AuthActions.autoLoginFailure();
    }
    const userData = JSON.parse(rawUserData);
    const loadedUser = new User(
      userData.email,
      userData.password,
      userData._token,
      new Date(userData._tokenExpirationDate)
      );
      if(loadedUser.token) {
        const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
        this.authService.setLogoutTimer(expirationDuration);
        return AuthActions.authSuccess({payload: {
          email: loadedUser.email,
          userId: loadedUser.password,
          token: loadedUser.token,
          expirationDate: new Date(userData._tokenExpirationDate),
          redirect: false,
        }})
    }
    return AuthActions.autoLoginFailure();
  })))

}
