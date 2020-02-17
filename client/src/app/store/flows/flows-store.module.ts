import { FlowFacade } from './../flow/facade/flow.facade';
import * as FlowReducer from '../flow/reducers/flow.reducers';
import { FlowEffects } from '../flow/effects/flow.effects';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
    imports: [
        CommonModule,
        StoreModule.forFeature('flows', FlowReducer.FlowReducer),
        EffectsModule.forFeature([FlowEffects])
    ],
    providers: [FlowEffects, FlowFacade]
})
export class FlowStoreModule {}
