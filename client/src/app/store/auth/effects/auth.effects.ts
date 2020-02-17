import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { switchMap, take, map } from 'rxjs/operators';
import * as AuthActions from '../actions/auth.actions';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';


@Injectable()
export class AuthEffects {

    constructor(private actions$: Actions, private http: HttpClient, private router: Router) { }

    @Effect()
    getUser = this.actions$
        .ofType(AuthActions.AuthActionTypes.GET_USER)
        .pipe(switchMap((action: AuthActions.GetUser) => {
            console.log(' go get it!');
            return this.http.get('/api/current_user', {
                observe: 'body',
                responseType: 'json'
            });
        }),
            take(1),
            switchMap((result) => {
                return [
                    new AuthActions.SetUser(result !== null ? result : null),
                    new AuthActions.SignInRedirect()
                ];
            })
        );

    @Effect({ dispatch: false })
    registrationRedirect$ = this.actions$.pipe(
        ofType<AuthActions.SignInRedirect>(AuthActions.AuthActionTypes.SIGNIN_REDIRECT),
        map((action: AuthActions.SignInRedirect) => {
            this.router.navigate(['/connect/frontpage']);
        })
    );
}
