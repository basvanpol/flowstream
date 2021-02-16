import { PostsState } from '../reducers/posts.reducer';
import { createFeatureSelector } from '@ngrx/store';
import { IAppState } from '../../app/app.state';

export const getPostsState = createFeatureSelector<IAppState, PostsState>('posts');
