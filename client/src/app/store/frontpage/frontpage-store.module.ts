import { FrontPageEffects } from './effects/frontpage.effects';
import * as FrontPageReducer from './reducers/frontpage.reducers';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FrontPageFacade } from './facade/frontpage.facade';

@NgModule({
    imports: [
        CommonModule,
        StoreModule.forFeature('frontpage', FrontPageReducer.FrontPageReducer),
        EffectsModule.forFeature([FrontPageEffects])
    ],
    providers: [FrontPageEffects, FrontPageFacade]
})
export class FrontPageStoreModule {}
