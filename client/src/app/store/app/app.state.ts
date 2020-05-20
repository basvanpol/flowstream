import { PostsState } from 'src/app/store/posts/reducers/posts.reducer';
import { IFrontPageState } from './../frontpage/reducers/frontpage.reducers';
import { IAuthState } from './../auth/reducers/auth.reducer';
import { IFlowState } from './../flow/reducers/flow.reducers';
import { IGroupState } from '../group/reducers/group.reducer';

export interface IAppState {
  flows: IFlowState;
  auth: IAuthState;
  frontpage: IFrontPageState;
  group: IGroupState;
  posts: PostsState;
}
