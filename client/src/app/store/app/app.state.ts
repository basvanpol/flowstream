import { PostsState } from 'src/app/store/posts/reducers/posts.reducer';
import { IFrontPageState } from './../frontpage/reducers/frontpage.reducers';
import { IAuthState } from './../auth/reducers/auth.reducer';
import { IFlowState } from './../flow/reducers/flow.reducers';
import { IGroupState } from '../group/reducers/group.reducer';
import { FeedState } from '../feed/reducers/feed.reducer';
import { TwitterState } from '../twitter/reducers/twitter.reducer';

export interface IAppState {
  flows: IFlowState;
  auth: IAuthState;
  frontpage: IFrontPageState;
  twitter: TwitterState;
  groups: IGroupState;
  posts: PostsState;
  feeds: FeedState;
}
