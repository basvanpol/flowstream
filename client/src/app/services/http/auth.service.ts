import * as AuthActions from '../../store/auth/actions/auth.actions';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { Store } from '@ngrx/store';

@Injectable()
export class AuthService {

    user: {} = null;

    constructor(private http: HttpClient, private router: Router, private store: Store<{ auth: {} }>) {
    }

    onSignInUser(user) {
        return this.http.post('/api/auth/local/signin', user, {
            observe: 'body',
            responseType: 'json'
        });
    }

    onSignInGoogleUser() {
        return this.http.post('/api/auth/google', {
            observe: 'body',
            responseType: 'json'
        });
    }

    getCurrentUser() {
        return this.http.get('/api/current_user', {
            observe: 'body',
            responseType: 'json'
        });
    }

    setUser(user) {
        this.user = user;
    }

    logout() {
        this.http.get('/api/logout', {
            observe: 'body',
            responseType: 'json'
        }).subscribe((res: any) => {
            console.log('user sign out, ', res);
            if (res.isLoggedOut) {
                console.log('user signed out');
                this.store.dispatch(new AuthActions.UserSignout());
                this.router.navigate(['/signin']);
            }
        });
    }

    isAuthenticated() {
        return this.user != null;
    }
}
