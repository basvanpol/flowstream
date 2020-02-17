import * as TwitterReducer from './reducers/twitter.reducer';
import { TwitterEffects } from './effects/twitter.effects';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
    imports: [
        CommonModule,
        StoreModule.forFeature('twitter', TwitterReducer.TwitterReducer),
        EffectsModule.forFeature([TwitterEffects])
    ],
    providers: [TwitterEffects]
})
export class TwitterStoreModule {}
