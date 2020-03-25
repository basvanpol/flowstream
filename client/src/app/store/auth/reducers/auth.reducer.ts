import { IUserFeedSubscription } from '../../../models/feed';
import * as AuthActions from '../actions/auth.actions';

export interface IAuthState {
  authenticated: boolean;
  _id: string;
  feedSubscriptions: IUserFeedSubscription[];
  isAuthenticating: boolean;
}

export const initialState: IAuthState = {
  authenticated: false,
  _id: null,
  feedSubscriptions: null,
  isAuthenticating: false
};

export function AuthReducer(state = initialState, action: AuthActions.AuthActions): IAuthState {
  switch (action.type) {
    case AuthActions.AuthActionTypes.SET_USER:
      return {
        ...action.payload,
        isAuthenticating: false,
        authenticated: (action.payload !== null) ? true : false
      };
    case AuthActions.AuthActionTypes.GET_USER:
      return {
        ...state,
        isAuthenticating: true
      };
    default:
      return state;
  }
}
