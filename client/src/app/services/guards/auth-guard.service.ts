import * as AuthActions from '../../store/auth/actions/auth.actions';
import * as fromAuth from '../../store/auth/reducers/auth.reducer';
import { Injectable } from '@angular/core';
import {
    Router, ActivatedRouteSnapshot,
    RouterStateSnapshot, CanActivate
} from '@angular/router';

import { Observable } from 'rxjs';
import { filter, switchMap, tap, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';


import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs/internal/observable/of';
import { IUser } from '../../models/user';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private http: HttpClient, private store: Store<fromAuth.IAuthState>) {
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
        return this.store.select('auth')
            .pipe(
                tap((state: fromAuth.IAuthState) => {
                    console.log(' guard 1', state);
                    if (state.authenticated) {
                        return of(true);
                    } else {
                        this.store.dispatch(new AuthActions.GetUser());
                    }
                }),
                tap((result: fromAuth.IAuthState) => {
                    console.log(' guard 2', result);
                    if (result && result.authenticated && result._id) {
                        return result;
                    } else {
                        this.router.navigate(['signin']);
                    }
                })
            );
    }
}

