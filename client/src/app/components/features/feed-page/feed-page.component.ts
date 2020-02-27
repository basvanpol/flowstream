import * as PostsActions from './../../../store/posts/actions/posts.actions';
import { PostsState } from '../../../store/posts/reducers/posts.reducer';
import { Store } from '@ngrx/store';
import { IPost } from '../../../models/post';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-feed-page',
  templateUrl: './feed-page.component.html',
  styleUrls: ['./feed-page.component.scss']
})
export class FeedPageComponent implements OnInit {

  feedPostsSubscription: Subscription;
  currentFeedPosts: IPost[];
  newSinceDate: number;
  currentSinceDate: number;
  selectedFeedIds: string[];

  constructor(private store: Store<PostsState>) { }

  ngOnInit() {
    this.feedPostsSubscription = this.store.select('posts').subscribe((state: PostsState) => {
      this.currentFeedPosts = state.currentPosts.posts;
      this.newSinceDate = state.newSinceDate;
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

}
