// src/app/components/shared/post/post-component
import { HttpClientModule } from '@angular/common/http';
import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { PostComponent } from './post.component';
import { PostContentComponent } from './post-content/post-content.component';
import { PostThumbOptionsComponent } from './post-thumb-options/post-thumb-options.component';
import { FeedResourceThumbComponent } from '../feed/feed-resource-thumb/feed-resource-thumb.component';
import { FeedResourceDateComponent } from '../feed/feed-resource-date/feed-resource-date.component';
import { FeedResourceNameComponent } from '../feed/feed-resource-name/feed-resource-name.component';
import { ImageLoadedComponent } from '../image-loaded/image-loaded.component';
import { SelectListComponent } from '../select-list/select-list.component';
import { IconFontComponent } from '../icon-font/icon-font.component';
import { ServicesModule } from '../../../services/services.module';
import { RootStoreModule } from '../../../store/root-store.module';
import { SharedModule} from '../../../components/shared/shared.module';
import { ModalModule} from '../../../components/shared/modals/modal.module';
import { FeaturesModule} from '../../../components/features/features.module';
import { RouterModule, Routes } from '@angular/router';
import { RoutesModule } from './../../../routes/routes.module';
import {APP_BASE_HREF} from '@angular/common';


export default {
  title: 'Post',
  decorators: [
    moduleMetadata({
      imports: [CommonModule, ServicesModule, SharedModule, HttpClientModule, RootStoreModule, ModalModule, FeaturesModule, RouterModule, RoutesModule],
      providers: [{provide: APP_BASE_HREF, useValue : '/' }]
    }),
  ],
};

const defaultPostData = {
  _id: '0',
  title: 'hello',
  contents: [],
  metaData: {
    authorThumb: 'zip',
    authorName: "Bèr",
    name: 'Jansen'
  },
  date: '10-12-2019',
  postType: 'TWITTER',
  comments: [],
  feedId: '1234',
  flows: [],
  tagData: [],
  users: [],
  iconClass: 'icon-flush'
};

export const defaultComponent = () => ({
  component: PostComponent,
  styleUrls: ['./post.component.scss'],
  template: `
  <app-post [post]="post" class="post-tmpl add-post" [ngClass]="{'first': i === 0, 'second': i === 1}"
          [showFull]="showFull" [showOverlay]="false"></app-post>
`, props: {
    post: defaultPostData,
    i: 0,
    showFull: false,
    name: 'jan',
    source: '',
    listData: [],
    selectedIdsOnLoaded: [],
    disabledIdsOnLoaded: []
  }
});
