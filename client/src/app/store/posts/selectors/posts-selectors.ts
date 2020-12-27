import { PostsState } from '../reducers/posts.reducer';
import { createFeatureSelector } from '@ngrx/store';
import { IAppState } from '../../flow/selectors/flow.selectors';

export const getPostsState = createFeatureSelector<IAppState, PostsState>('posts');
