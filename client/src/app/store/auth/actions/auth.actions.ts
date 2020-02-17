import { Action } from '@ngrx/store';

export enum AuthActionTypes {
  GET_USER = 'GET_USER',
  USER_SIGNOUT = 'USER_SIGNOUT',
  SET_USER = 'SET_USER',
  SIGNIN_REDIRECT = 'SIGNIN_REDIRECT'
}

export class GetUser implements Action {
  readonly type = AuthActionTypes.GET_USER;
}
export class UserSignout implements Action {
  readonly type = AuthActionTypes.USER_SIGNOUT;
}
export class SetUser implements Action {
  readonly type = AuthActionTypes.SET_USER;
  constructor( public payload: any) {}
}
export class SignInRedirect implements Action {
  readonly type = AuthActionTypes.SIGNIN_REDIRECT;
}

export type AuthActions = GetUser | UserSignout | SetUser | SignInRedirect;
