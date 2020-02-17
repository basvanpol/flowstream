import { IUserFeedSubscription } from '../../../models/feed';
import * as AuthActions from '../actions/auth.actions';

export interface IAuthState {
  authenticated: boolean;
  _id: string;
  feedSubscriptions: IUserFeedSubscription[];
}

export const initialState: IAuthState = {
  authenticated: false,
  _id: null,
  feedSubscriptions: null
};

export function AuthReducer(state = initialState, action: AuthActions.AuthActions): IAuthState {
  switch (action.type) {
    case AuthActions.AuthActionTypes.SET_USER:
    console.log('set user ', action.payload);
      return {
        ...action.payload,
        authenticated: (action.payload !== null) ? true : false
      };
    default:
      return state;
  }
}
