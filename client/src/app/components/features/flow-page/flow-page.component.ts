import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IPost } from 'src/app/models/post';
import { Store } from '@ngrx/store';
import { PostsState } from 'src/app/store/posts/reducers/posts.reducer';

@Component({
  selector: 'app-flow-page',
  templateUrl: './flow-page.component.html',
  styleUrls: ['./flow-page.component.scss']
})
export class FlowPageComponent implements OnInit {

  flowPostsSubscription: Subscription;
  currentFlowPosts: IPost[];

  constructor(private store: Store<PostsState>) { }

  ngOnInit() {
    this.flowPostsSubscription = this.store.select('posts').subscribe((state: PostsState) => {
      this.currentFlowPosts = state.currentPosts.posts;
    });
  }

}
