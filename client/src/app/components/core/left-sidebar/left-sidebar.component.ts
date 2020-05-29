import { IMutatedGroup, GroupMutations } from './../../../store/group/reducers/group.reducer';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { GroupVM } from './../../../models/group';
import { FeedVM } from './../../../models/feed';
import { Router } from '@angular/router';
import { AddFeedComponent } from '../../features/add-feed/add-feed.component';
import * as FeedPostsActions from '../../../store/posts/actions/posts.actions';
import { IUserFeedSubscription, FeedFeedVM } from '../../../models/feed';
import { Store, select } from '@ngrx/store';
import { IAuthState } from '../../../store/auth/reducers/auth.reducer';
import { PostsState } from '../../../store/posts/reducers/posts.reducer';
import { Subscription } from 'rxjs';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GroupFacade } from 'src/app/store/group/facade/group.facade';
import { IAppState } from 'src/app/store/app/app.state';

interface IMappedFeedGroup {
  group: GroupVM;
  subscriptions: IUserFeedSubscription[];
}

@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.scss']
})
export class LeftSidebarComponent implements OnInit, OnDestroy {

  @Input() headerTop: number;
  @Input() scrollTop: number;
  isOpen = false;
  userSubscription: Subscription;
  authState: IAuthState;
  mutatedGroupSubscription: Subscription;

  feedGroups: IMappedFeedGroup[];
  mappedFeedGroups: IMappedFeedGroup[];


  constructor(
    public dialog: MatDialog,
    private store: Store<IAppState>,
    private router: Router,
    private groupFacade: GroupFacade) { }

  openAddFeedDialog() {
    const dialogRef = this.dialog.open(AddFeedComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '100%',
      maxHeight: '100%',
    });
  }

  ngOnInit() {
    this.userSubscription = this.store.pipe(untilDestroyed(this), select('auth')).subscribe((state: IAuthState) => {
      this.authState = state;
      this.parseFeedSubscriptions(this.authState.feedSubscriptions);
    });

    this.mutatedGroupSubscription = this.groupFacade.mutatedGroup$.pipe(untilDestroyed(this)).subscribe((mutatedGroup: IMutatedGroup) => {
      if (!!mutatedGroup) {
        switch (mutatedGroup.mutation) {
          case GroupMutations.SAVED:
            this.updateFeedGroupsWithSavedGroup(mutatedGroup);
            break;
          case GroupMutations.DELETED:
            this.updateFeedGroupsWithDeletdGroup(mutatedGroup);
            break;
          default:
            break;
        }
      }
    });
  }

  parseFeedSubscriptions(feedSubscriptions: IUserFeedSubscription[]) {
    this.feedGroups = [];
    if (!feedSubscriptions) {
      return;
    }
    feedSubscriptions.forEach((subscription) => {
      if (!!subscription._group) {
        const groupId = subscription._group._id;
        this.feedGroups[groupId] = this.feedGroups[groupId] || {
          group: { ...subscription._group },
          subscriptions: []
        };
        this.feedGroups[groupId].subscriptions.push(subscription);
      }
    });
    this.mapFeedGroups();
  }

  updateFeedGroupsWithSavedGroup(mutatedGroup: IMutatedGroup) {
    // console.log('left sidebar: ', mutatedGroup);
    if (this.feedGroups[mutatedGroup.group._id]) {
      this.feedGroups[mutatedGroup.group._id].group = mutatedGroup.group;
    }
    this.mapFeedGroups();
  }

  updateFeedGroupsWithDeletdGroup(mutatedGroup: IMutatedGroup) {
    if (this.feedGroups[mutatedGroup.group._id]) {
      delete this.feedGroups[mutatedGroup.group._id];
    }
    // console.log('mutatedGroup', mutatedGroup);
    // console.log('delete groups', this.feedGroups);
    this.mapFeedGroups();
  }

  mapFeedGroups() {
    this.mappedFeedGroups = Object.keys(this.feedGroups).map((groupId) => {
      return {
        group: { ...this.feedGroups[groupId].group },
        subscriptions: [...this.feedGroups[groupId].subscriptions]
      };
    });
  }

  onOpenFeedGroup($event: Event, feedSubscriptionGroup: IMappedFeedGroup) {
    $event.stopPropagation();
    const payload = {
      feedIds: feedSubscriptionGroup.subscriptions.map((feedSubscription: IUserFeedSubscription) => {
        return feedSubscription._feed.feedId;
      }),
      newSinceDate: null
    };
    this.store.dispatch(new FeedPostsActions.LoadFeedPosts(payload));
    this.router.navigate(['/feed']);
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

  ngOnDestroy() { }
}
