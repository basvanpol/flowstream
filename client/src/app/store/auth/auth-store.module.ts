import { AuthFacade } from './facade/auth.facade';
import { AuthEffects } from './effects/auth.effects';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as AuthReducer from './reducers/auth.reducer';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('auth', AuthReducer.AuthReducer),
    EffectsModule.forFeature([AuthEffects])
  ],
  providers: [AuthEffects, AuthFacade]
})
export class AuthStoreModule { }
