import * as AuthActions from '../../store/auth/actions/auth.actions';
import * as fromAuth from '../../store/auth/reducers/auth.reducer';
import { Injectable } from '@angular/core';
import {
  Router, ActivatedRouteSnapshot,
  RouterStateSnapshot, CanActivate
} from '@angular/router';

import { Observable } from 'rxjs';
import { filter, switchMap, tap, take } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';


import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs/internal/observable/of';
import { IUser } from '../../models/user';
import { getAuthState } from '../../store/auth/selectors/auth.selectors';
import { IAppState } from '../../store/flow/selectors/flow.selectors';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private http: HttpClient, private store: Store<IAppState>) {
  }

  canActivate(): Observable<boolean> | boolean {
    return this.getFromStoreOrApi()
      .pipe(switchMap((result) => {
        if (result) {
          return of(true);
        } else {
          return of(false);
        }
      }));
  }

  getFromStoreOrApi(): any {
    return this.store
      .pipe(
        select(getAuthState),
        tap((state: fromAuth.IAuthState) => {
          if (state.authenticated) {
            return of(true);
          } else if (state.isAuthenticating) {
            return of(false);
          } else {
            this.store.dispatch(new AuthActions.GetUser());
          }
        }),
        tap((result: fromAuth.IAuthState) => {
          console.log('result', result);
          if (result && result.authenticated && result._id) {
            return result;
          } else if (result.isAuthenticating) {
            console.log(' is authenticating! ');
            return result;
          } else {
            console.log('aloha!');
            this.router.navigate(['signin']);
          }
        })
      );
  }
}

