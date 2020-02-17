import { GeneralSelectionEffects } from './effects/general-selection.effects';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as fromGeneralSelection from './reducers/general-selection.reducer';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('general-selection', fromGeneralSelection.GeneralSelectionReducer),
    EffectsModule.forFeature([GeneralSelectionEffects])
  ],
  providers: [GeneralSelectionEffects]
})
export class GeneralModule { }
