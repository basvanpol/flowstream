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
    .ofType(AuthActions.AuthActionTypes.GET_USER)
    .pipe(switchMap((action: AuthActions.GetUser) => {
      console.log('get current user');
      return this.http.get('/api/current_user', {
        observe: 'body',
        responseType: 'json'
      });
    }),
      take(1),
      switchMap((result) => {
        console.log('result user!', result);
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
      console.log('effect state', this.router);
      console.log('route', this.route);
      console.log('snapshot', this.router.routerState.snapshot.url);
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
        console.log('is forwarded url')
        this.router.navigateByUrl(this.router.routerState.snapshot.url);
      } else {
        this.router.navigate(['/frontpage']);
      }
    })
  );
}
