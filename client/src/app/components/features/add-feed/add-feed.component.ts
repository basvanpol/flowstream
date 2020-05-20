import { FeedVM, FeedFeedVM, FeedActionType, IUserFeedSubscription } from '../../../models/feed';
import { SelectConfirmationModalComponent } from '../../shared/modals/select-confirmation-modal/select-confirmation-modal.component';
import { GroupVM } from '../../../models/group';
import { areArraysUnequal } from '../../../utils/comparative.methods';
import * as GroupActions from '../../../store/group/actions/group.actions';
import { FeedState } from '../../../store/feed/reducers/feed.reducer';
import { IGroupState } from '../../../store/group/reducers/group.reducer';
import { DefaultFormComponent } from '../../shared/default-form/default-form.component';
import { FeedSubscription } from '../../../models/feed';
import { IAuthState } from '../../../store/auth/reducers/auth.reducer';
import * as FeedActions from '../../../store/feed/actions/feed.actions';
import { Subscription } from 'rxjs';
import * as TwitterActions from '../../../store/twitter/actions/twitter.actions';
import { TwitterState } from '../../../store/twitter/reducers/twitter.reducer';
import { Store } from '@ngrx/store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm, FormGroup, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-add-feed',
  templateUrl: './add-feed.component.html',
  styleUrls: ['./add-feed.component.scss']
})
export class AddFeedComponent extends DefaultFormComponent implements OnInit, OnDestroy {

  searchQuery: string;
  twitterSubscription: Subscription;
  authSubscription: Subscription;
  searchFeedsData: any[] = [];
  authState: any;
  selectedGroupName: string;
  groupsSubscription: Subscription;
  feedStateSubscription: Subscription;
  feedState: FeedState;
  groupState: IGroupState;
  adminGroups: any[];
  saveGroupSuccess: boolean;
  selectedAdminGroup: GroupVM;
  showSearchResults = false;
  selectedTabIndex = 0;
  featuredFeeds: FeedVM[];
  groupFeeds: any[];
  groupedSubscriptions: {
    [id: number]: number
  };
  public isLoading = false;

  constructor(
    private store: Store<TwitterState | IAuthState>,
    public dialogRef: MatDialogRef<AddFeedComponent>,
    public selectConfirmDialog: MatDialog) {
    super();
  }

  ngOnInit() {

    this.twitterSubscription = this.store.select('twitter')
      .subscribe((state: TwitterState) => {
        this.searchFeedsData = state.searchFeedsResult.data;
      });

    this.authSubscription = this.store.select('auth')
      .subscribe((state: IAuthState) => {
        this.authState = state;
        this.mapFeedSubscriptions(this.authState.feedSubscriptions);
        this.setSubscribed();
      });


    this.groupsSubscription = this.store.select('group').subscribe((state: IGroupState) => {
      this.groupState = state;
      this.selectedAdminGroup = this.groupState.selectedAdminGroup;
      this.saveGroupSuccess = this.groupState.saveGroupSuccess;
      this.isLoading = this.groupState.loading;

      if (this.saveGroupSuccess) {
        this.store.dispatch(new GroupActions.SaveGroupReset());
        // this.store.dispatch(new GroupActions.LoadAdminGroups());
      }

      // check if this.adminGroups and groupState.adminGroups arrays are different, if so, select the last one or the top one
      if (this.adminGroups && this.groupState.adminGroups) {
        if (areArraysUnequal(this.adminGroups, this.groupState.adminGroups, '_id')) {
          if (this.adminGroups.length < this.groupState.adminGroups.length) {
            this.selectListState('last');
          } else {
            this.selectListState('first');
          }
        }
      } else if (!this.adminGroups && !this.isLoading) {
        this.selectListState('first');
      }

      this.adminGroups = this.groupState.adminGroups;

      if (this.featuredFeeds && this.selectedAdminGroup) {
        this.filterGroupFeeds();
        this.setSubscribed();
      }
    });

    this.feedStateSubscription = this.store.select('feeds').subscribe((state: FeedState) => {
      this.feedState = state;
      if (!this.feedState.featuredFeeds) {
        this.store.dispatch(new FeedActions.GetFeatureFeeds());
      } else {
        this.featuredFeeds = this.feedState.featuredFeeds;
        if (this.featuredFeeds && this.selectedAdminGroup) {
          this.filterGroupFeeds();
          this.setSubscribed();
        }
      }
    });

    this.formGroup = new FormGroup({
      'searchInput': new FormControl(null)
    });

    if (!this.adminGroups) {
      this.store.dispatch(new GroupActions.LoadAdminGroups());
    }
  }

  mapFeedSubscriptions(feedSubscriptions: IUserFeedSubscription[]) {
    const groups = {};
    feedSubscriptions.forEach((subscription) => {
      if (!!subscription._group) {
        const groupId = subscription._group._id;
        groups[groupId] = groups[groupId] || [];
        groups[groupId].push(subscription._feed.feedId);
      }
    });
    this.groupedSubscriptions = groups;
  }

  filterGroupFeeds() {
    if (this.featuredFeeds && this.featuredFeeds.length > 0) {
      this.groupFeeds = this.featuredFeeds.filter((feed) => {
        return feed._group === this.selectedAdminGroup._id;
      });
    } else {
      this.groupFeeds = [];
    }
  }

  setSubscribed() {
    if (this.groupFeeds && this.groupFeeds.length > 0) {
      this.groupFeeds = this.groupFeeds.map((feed) => {
        return {
          ...feed,
          subscribed: this.checkSubscribed(feed)
        };
      });
    }
  }

  checkSubscribed(feed: FeedVM) {
    const groupSubsriptions = this.groupedSubscriptions[this.selectedAdminGroup._id];
    if (groupSubsriptions && groupSubsriptions.length > 0) {
      return groupSubsriptions.includes(feed._feed.feedId);
    } else {
      return false;
    }
  }

  handleSubscription(feed: FeedVM) {
    if (feed.subscribed) {
      this.unsubscribeFromFeed(feed._feed)
    } else {
      this.subscribeToFeed(feed._feed)
    }
  }

  filterFeedGroups(feed: FeedFeedVM): string[] {
    let feedGroups: string[] = [];
    if (this.featuredFeeds && this.featuredFeeds.length > 0) {
      feedGroups = this.featuredFeeds.filter((featuredFeed) => {
        return featuredFeed._feed.feedId === feed.feedId;
      }).map((featuredFeed) => {
        return featuredFeed._group;
      });
      if (!feedGroups || feedGroups.length === 0) {
        feedGroups = [];
      }
    }
    return feedGroups;

  }


  selectListState(sPosition: string) {
    const newAdminGroups = this.groupState.adminGroups;
    if (newAdminGroups && newAdminGroups.length > 0) {
      switch (sPosition) {
        case 'first':
          this.selectGroup(newAdminGroups[0]);
          break;
        case 'last':
          const latestItemIndex = newAdminGroups.length - 1;
          this.selectGroup(newAdminGroups[latestItemIndex]);
          break;
      }
    }
  }

  selectGroup(item: any) {
    if (item && item._id) {
      const group: GroupVM = {
        _id: item._id,
        title: item.title,
        _user: item._user,
        icon: item.icon
      };
      this.store.dispatch(new GroupActions.SelectGroup(group));
      // get model portfolio data
      // this.store.dispatch(new FeedActions.GetFeatureFeeds(group));
    }
  }

  onSelectGroup(event: any) {
    if (event && event.item) {
      this.selectGroup(event.item);
    }
  }

  onDeleteGroup(event: any) {
    this.store.dispatch(new GroupActions.DeleteGroup(event.item));
  }

  onSearchSubmit(form: NgForm) {
    this.searchQuery = form.value.searchInput;
    this.store.dispatch(new TwitterActions.SearchFeeds(this.searchQuery));
    this.showSearchResults = true;
    this.selectedTabIndex = 1;
  }

  closeDialog() {
    this.dialogRef.close();
  }

  subscribeToFeed(feed: any) {

    const subscriptionRequestObject: FeedSubscription = {
      feedType: 'TWITTER',
      feed:
      {
        feedName: feed.name,
        feedId: feed.feedId,
        feedIcon: feed.feedIcon
      }
      ,
      feedIcon: feed.thumb,
      userId: this.authState._id,
      groups: [
        this.selectedAdminGroup._id
      ],
      actionType: FeedActionType.SUBSCRIBE
    };
    this.store.dispatch(new FeedActions.SubscribeTofeed(subscriptionRequestObject));
  }

  unsubscribeFromFeed(feed: any) {

    const subscriptionRequestObject: FeedSubscription = {
      feedType: 'TWITTER',
      feed:
      {
        feedName: feed.name,
        feedId: feed.feedId,
        feedIcon: feed.feedIcon
      }
      ,
      feedIcon: feed.thumb,
      userId: this.authState._id,
      groups: [
        this.selectedAdminGroup._id
      ],
      actionType: FeedActionType.UNSUBSCRIBE
    };
    this.store.dispatch(new FeedActions.UnsubscribeFromFeed(subscriptionRequestObject));
  }

  addTofeatureList(feed: any) {

    const featureRequestObject: FeedSubscription = {
      feedType: 'TWITTER',
      feed: {
        feedName: feed.feedName,
        feedId: feed.feedId,
        feedIcon: feed.feedIcon
      },
      feedIcon: feed.feedIcon,
      userId: this.authState._id,
      groups: [],
      actionType: FeedActionType.FEATURE
    };

    this.selectConfirmDialog.open(SelectConfirmationModalComponent, {
      width: '420px',
      maxHeight: '500px',
      data: {
        selectionList: this.adminGroups,
        selectedIdsOnLoaded: this.filterFeedGroups(feed),
        callback: (selectedItems) => {
          selectedItems.forEach((group) => {
            featureRequestObject.groups.push(group._id);
          });
          this.store.dispatch(new FeedActions.AddToFeatureList(featureRequestObject));
        }
      }
    });
  }

  removeFromFeatureList(feed: any) {
    // const featureRequestObject: FeedSubscription = {
    //   feedType: 'TWITTER',
    //   feed:
    //     {
    //       feedName: feed.name,
    //       feedId: feed.id
    //     }
    //   ,
    //   feedIcon: feed.thumb,
    //   userId: this.authState._id,
    //   groups: []
    // };
    // this.store.dispatch(new FeedActions.RemoveFromFeatureList(featureRequestObject));
  }

  ngOnDestroy() {
    this.feedStateSubscription.unsubscribe();
    this.groupsSubscription.unsubscribe();
    this.authSubscription.unsubscribe();
    this.twitterSubscription.unsubscribe();
  }

}
