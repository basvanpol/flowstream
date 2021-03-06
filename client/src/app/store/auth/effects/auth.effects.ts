import { Router, RouterStateSnapshot, ActivatedRoute, PRIMARY_OUTLET } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { switchMap, take, map } from 'rxjs/operators';
import * as AuthActions from '../actions/auth.actions';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';


@Injectable()
export class AuthEffects {

  constructor(private actions$: Actions, private http: HttpClient, private router: Router, private route: ActivatedRoute) { }

  @Effect()
  getUser = this.actions$
    .pipe(
      ofType(AuthActions.AuthActionTypes.GET_USER),
      switchMap((action: AuthActions.GetUser) => {
        return this.http.get('/api/current_user', {
          observe: 'body',
          responseType: 'json'
        });
      }),
      take(1),
      switchMap((result) => {
        if (!result) {
          this.router.navigate(['/signin']);
          return [
            new AuthActions.SetUser(result !== null ? result : null),
          ];
        } else {
          return [
            new AuthActions.SetUser(result !== null ? result : null),
            new AuthActions.SignInRedirect()
          ];
        }
      })
    );

  @Effect({ dispatch: false })
  registrationRedirect$ = this.actions$.pipe(
    ofType<AuthActions.SignInRedirect>(AuthActions.AuthActionTypes.SIGNIN_REDIRECT),
    map((action: AuthActions.SignInRedirect) => {
      const tree = this.router.parseUrl(this.router.routerState.snapshot.url);
      const children = tree.root.children[PRIMARY_OUTLET];
      let isForwardedUrl = false;
      if (!!children) {
        const segments = children.segments;
        if (!!segments && (segments[0].path === 'flow' || segments[0].path === 'invite')) {
          isForwardedUrl = true;
        }
      }
      if (!!this.router.routerState.snapshot.url && isForwardedUrl) {
        this.router.navigateByUrl(this.router.routerState.snapshot.url);
      } else {
        this.router.navigate(['/frontpage']);
      }
    })
  );
}
