import { FeedEffects } from './effects/feed.effects';
import * as FeedReducer from './reducers/feed.reducer';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
    imports: [
        CommonModule,
        StoreModule.forFeature('feeds', FeedReducer.FeedReducer),
        EffectsModule.forFeature([FeedEffects])
    ],
    providers: [FeedEffects]
})
export class FeedStoreModule { }
