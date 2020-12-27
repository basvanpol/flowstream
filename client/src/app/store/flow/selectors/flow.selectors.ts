import { IAuthState } from './../../auth/reducers/auth.reducer';
import { IFlowState } from './../reducers/flow.reducers';
import { FlowVM } from './../../../models/flow';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { createEntityAdapter } from '@ngrx/entity';
import { IFrontPageState } from '../../frontpage/reducers/frontpage.reducers';
import { TwitterState } from '../../twitter/reducers/twitter.reducer';
import { GroupState } from '../../group/reducers/group.reducer';
import { FeedState } from '../../feed/reducers/feed.reducer';
import { PostsState } from '../../posts/reducers/posts.reducer';

export interface IAppState {
    flows: IFlowState;
    auth: IAuthState;
    frontpage: IFrontPageState;
    twitter: TwitterState;
    groups: GroupState;
    feeds: FeedState;
    posts: PostsState;
}

export const getFlowsState = createFeatureSelector<IAppState, IFlowState>('flows');

export const flowAdapter = createEntityAdapter<FlowVM>({
    selectId: (flow: FlowVM) => flow._id
});

export const getSelectedFlowIds = createSelector(
    getFlowsState,
    (state) => {
      return state.ids;
    }
  );


export const {
    selectAll: selectAllFlows,
    selectEntities: selectAll
} = flowAdapter.getSelectors(getFlowsState);


// export const getSelectedFlow = createSelector(
//     getFlowsState,
//     (state: IFlowState) => {
//         const selectedFlow = {
//             ...state.entities[state.selectedFlowId]
//         };
//         return selectedFlow;
//     }
// );





