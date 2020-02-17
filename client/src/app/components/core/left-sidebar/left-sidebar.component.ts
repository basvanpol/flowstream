import { Router } from '@angular/router';
import { AddFeedComponent } from '../../features/add-feed/add-feed.component';
import * as FeedPostsActions from '../../../store/posts/actions/posts.actions';
import { IUserFeedSubscription, FeedFeedVM } from '../../../models/feed';
import { Store } from '@ngrx/store';
import { IAuthState } from '../../../store/auth/reducers/auth.reducer';
import { PostsState } from '../../../store/posts/reducers/posts.reducer';
import { Subscription } from 'rxjs';
import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.scss']
})
export class LeftSidebarComponent implements OnInit {

  @Input() headerTop: number;
  isOpen = false;
  userSubscription: Subscription;
  authState: IAuthState;
  mappedSubscriptions: {
      groupId: string,
      groupTitle: string,
      feedSubscriptions: any[]
  }[];


  constructor(public dialog: MatDialog, private store: Store<IAuthState|PostsState>, private router: Router) { }

  openAddFeedDialog() {
    const dialogRef = this.dialog.open(AddFeedComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '100%',
      maxHeight: '100%',
    });
  }

  ngOnInit() {
      this.userSubscription = this.store.select('auth').subscribe((state: IAuthState) => {
        this.authState = state;
        this.mapFeedSubscriptions(this.authState.feedSubscriptions);
      });
  }

  mapFeedSubscriptions(feedSubscriptions: IUserFeedSubscription[]) {
    const groups = {};
    feedSubscriptions.forEach(( subscription ) => {
      if(!!subscription._group){
        const groupId = subscription._group._id;
        groups[groupId] = groups[groupId] || [];
        groups[groupId].push(subscription);
      }
    });
    this.mappedSubscriptions = Object.keys(groups).map(( group ) => {
      return groups[group];
    });
  }

  onOpenFeed(feed: FeedFeedVM) {
    const payload = {
      feedIds: [feed.feedId],
      newSinceDate: null
    };
    this.store.dispatch(new FeedPostsActions.LoadFeedPosts(payload));
    this.router.navigate(['/feed']);
  }

  goHome() {
    this.router.navigate(['/frontpage']);
  }
}
