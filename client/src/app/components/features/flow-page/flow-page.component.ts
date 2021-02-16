import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { IPost } from 'src/app/models/post';
import { Store, select } from '@ngrx/store';
import { PostsState } from 'src/app/store/posts/reducers/posts.reducer';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { getPostsState } from '../../../store/posts/selectors/posts.selectors';
import { IAppState } from 'src/app/store/app/app.state';

@Component({
  selector: 'app-flow-page',
  templateUrl: './flow-page.component.html',
  styleUrls: ['./flow-page.component.scss']
})
export class FlowPageComponent implements OnInit, OnDestroy {

  flowPostsSubscription: Subscription;
  currentFlowPosts: IPost[];

  constructor(private store: Store<IAppState>) { }

  ngOnInit() {
    this.store.pipe(untilDestroyed(this), select(getPostsState)).subscribe((state: PostsState) => {
      this.currentFlowPosts = state.currentPosts.posts;
    });
  }

  ngOnDestroy() { }

}
