import { UtilsModule } from './../utils/utils.module';
import { FeedPageComponent } from './feed-page/feed-page.component';
import { NgModule } from '@angular/core';
import { AddGroupComponent } from './add-group/add-group.component';
import { AddFlowComponent } from './add-flow/add-flow.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AddFeedComponent } from './add-feed/add-feed.component';

import { SharedModule } from '../shared/shared.module';
import { FrontPageComponent } from './front-page/front-page.component';
import { AddPostComponent } from './add-post/add-post.component';
import { FlowPageComponent } from './flow-page/flow-page.component';

@NgModule({
  imports: [
    UtilsModule,
    SharedModule,
    ReactiveFormsModule
  ],
  declarations: [
    AddFeedComponent,
    AddFlowComponent,
    AddGroupComponent,
    FeedPageComponent,
    FrontPageComponent,
    AddPostComponent,
    FlowPageComponent
  ],
  entryComponents: [
    AddFeedComponent,
    AddFlowComponent,
    AddGroupComponent,
    AddPostComponent
  ],
  exports: [AddPostComponent]
})
export class FeaturesModule { }
