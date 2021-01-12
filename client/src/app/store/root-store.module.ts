import { FrontPageStoreModule } from './frontpage/frontpage-store.module';
import { GroupStoreModule } from './group/group-store.module';
import { FlowStoreModule } from './flows/flows-store.module';
import { FeedStoreModule } from './feed/feed-store.module';
import { TwitterStoreModule } from './twitter/twitter-store.module';
import { HttpClientModule } from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';
import { AuthStoreModule } from './auth/auth-store.module';
import { PostsStoreModule } from './posts/posts-store.module';
import { GeneralModule } from './general/general.module';

@NgModule({
  imports: [
    HttpClientModule,
    TwitterStoreModule,
    FeedStoreModule,
    FlowStoreModule,
    GroupStoreModule,
    AuthStoreModule,
    PostsStoreModule,
    FrontPageStoreModule,
    GeneralModule,
    StoreModule.forRoot({}, {
      runtimeChecks: {
        strictStateImmutability: false,
        strictActionImmutability: false,
        strictStateSerializability: false,
        strictActionSerializability: false,
      },
      metaReducers: [] }),
    EffectsModule.forRoot([])
  ]
})
export class RootStoreModule { }
