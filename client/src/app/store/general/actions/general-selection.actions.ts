import { Action } from '@ngrx/store';

export enum GeneralSelectionActionTypes {
  LOAD_DYNAMIC_MODAL_COMPONENT = 'LOAD_DYNAMIC_MODAL_COMPONENT',
  CLOSE_DYNAMIC_MODAL_COMPONENT = 'CLOSE_DYNAMIC_MODAL_COMPONENT'
}

export class LoadDynamicModalComponent implements Action {
  readonly type = GeneralSelectionActionTypes.LOAD_DYNAMIC_MODAL_COMPONENT;
  constructor( public payload: any) {}
}
export class CloseDynamicModalComponent implements Action {
  readonly type = GeneralSelectionActionTypes.CLOSE_DYNAMIC_MODAL_COMPONENT;
  constructor( public payload: any) {}
}

export type GeneralSelectionActions = CloseDynamicModalComponent | LoadDynamicModalComponent;
