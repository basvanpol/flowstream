import { GroupVM } from './group';
export interface FeedSubscription {
    feedType: string;
    feed: {
        feedName: string;
        feedId: string;
        feedIcon: string;
    };
    feedIcon: string;
    userId: string;
    groups: string[];
    actionType: FeedActionType;
}

export interface IUserFeedSubscription {
        _feed: FeedFeedVM;
        _group: GroupVM;
        _id: string;
}

export enum FeedActionType {
    SUBSCRIBE = 'subscribe',
    UNSUBSCRIBE = 'unsubscribe',
    FEATURE = 'feature'
}

export interface FeedVM {
    active: boolean;
    _feed: FeedFeedVM;
    _group: string;
    _id: string;
    _user: string;
    subscribed?: boolean;
    canUserEdit?: boolean;
}

export interface FeedFeedVM {
    feedId: string;
    feedName: string;
    feedType: string;
    feedIcon: string;
}
