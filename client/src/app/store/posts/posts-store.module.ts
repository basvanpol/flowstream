import { PostsEffects } from './effects/posts.effects';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { postsReducer } from './reducers/posts.reducer';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('posts', postsReducer),
    EffectsModule.forFeature([PostsEffects])
  ],
  providers: [PostsEffects]
})
export class PostsStoreModule { }
