import { getAuthState } from './../selectors/auth.selectors';
import { Injectable } from "@angular/core";
import { Store, select } from "@ngrx/store";
import * as AuthReducer from './../reducers/auth.reducer';

@Injectable()
export class AuthFacade {

    public authState$ = this.store.pipe(
        select(getAuthState)
      );
    constructor(private store: Store<any>) {

    }
}
