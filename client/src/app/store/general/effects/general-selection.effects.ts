import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { GeneralSelectionActionTypes } from '../actions/general-selection.actions';

@Injectable()
export class GeneralSelectionEffects {
  constructor(private actions$: Actions) {}
}
