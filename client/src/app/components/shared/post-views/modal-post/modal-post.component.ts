import { PostsState } from './../../../../store/posts/reducers/posts.reducer';
import { select } from '@ngrx/store';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { IPost } from './../../../../models/post';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-modal-post',
  templateUrl: './modal-post.component.html',
  styleUrls: ['./modal-post.component.scss']
})
export class ModalPostComponent implements OnInit, OnDestroy {

  public post: IPost = null;
  private postsSubscription$: Subscription;

  constructor(private store: Store<any>) {
    this.postsSubscription$ = this.store.pipe(untilDestroyed(this), select('posts')).subscribe((postsState: PostsState) => {
      if (postsState.selectedPost && this.post !== postsState.selectedPost) {
        this.post = postsState.selectedPost;
        console.log('this.post', this.post);
      }
    });
  }

  ngOnInit() {}

  ngOnDestroy() {}

}
