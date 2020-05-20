import { EffectsModule } from '@ngrx/effects';
import { GroupEffects } from './effects/group.effects';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import * as fromGroup from './reducers/group.reducer';
import { GroupFacade } from './facade/group.facade';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('group', fromGroup.reducer),
    EffectsModule.forFeature([GroupEffects])
  ],
  providers: [GroupEffects, GroupFacade]
})
export class GroupStoreModule {}

