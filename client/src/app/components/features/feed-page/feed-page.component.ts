import { areArraysUnequal } from './../../../utils/comparative.methods';
import * as PostsActions from './../../../store/posts/actions/posts.actions';
import { PostsState } from '../../../store/posts/reducers/posts.reducer';
import { Store, select } from '@ngrx/store';
import { IPost } from '../../../models/post';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { getPostsState } from '../../../store/posts/selectors/posts.selectors';
import { IAppState } from 'src/app/store/app/app.state';

@Component({
  selector: 'app-feed-page',
  templateUrl: './feed-page.component.html',
  styleUrls: ['./feed-page.component.scss']
})
export class FeedPageComponent implements OnInit, OnDestroy {

  feedPostsSubscription: Subscription;
  currentFeedPosts: IPost[];
  newSinceDate: number;
  currentSinceDate: number;
  selectedFeedIds: string[];

  constructor(@Inject(DOCUMENT) private document: Document, private store: Store<IAppState>) { }

  ngOnInit() {
    this.store.pipe(untilDestroyed(this), select(getPostsState)).subscribe((state: PostsState) => {
      this.currentFeedPosts = state.currentPosts.posts;
      this.newSinceDate = state.newSinceDate;
      if ((this.selectedFeedIds && areArraysUnequal(this.selectedFeedIds, state.selectedFeedIds)) || !this.newSinceDate) {
        window.scrollTo(0, 0);
      }

      this.selectedFeedIds = state.selectedFeedIds;
    });
  }

  onLoadMore(loadMore: boolean) {

    if (!!this.newSinceDate && !!loadMore) {
      if (this.currentSinceDate !== this.newSinceDate) {
        this.currentSinceDate = this.newSinceDate;
        const payload = {
          feedIds: [...this.selectedFeedIds],
          newSinceDate: this.newSinceDate
        };
        this.store.dispatch(new PostsActions.LoadFeedPosts(payload));
      }
    }
  }

  ngOnDestroy() { }

}
