import { Action } from '@ngrx/store';
import { GeneralSelectionActions, GeneralSelectionActionTypes } from '../actions/general-selection.actions';

export interface IGeneralSelectionState {
  dynamicComponent: any;
  showDynamicComponent: boolean;
}

export const initialState: IGeneralSelectionState = {
  dynamicComponent: null,
  showDynamicComponent: false
};

export function GeneralSelectionReducer(state = initialState, action: GeneralSelectionActions): IGeneralSelectionState {
  switch (action.type) {

    case GeneralSelectionActionTypes.LOAD_DYNAMIC_MODAL_COMPONENT:
      return {
        ...state,
        dynamicComponent: action.payload,
        showDynamicComponent: true
      };
    case GeneralSelectionActionTypes.CLOSE_DYNAMIC_MODAL_COMPONENT:
      return {
        ...state,
        dynamicComponent: null,
        showDynamicComponent: false
      };
    default:
      return state;
  }
}
