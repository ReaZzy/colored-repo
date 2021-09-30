import { ThunkDispatch } from 'redux-thunk';
import { PostActionTypes } from '../../../types/IRedux.types';
import { RootState } from '../rootReducer';
import { setFetchingPost, setPosts, setTotalPost, setLike } from './actions';
import { getPostsRequest, setLikeRequest } from './api';

export const getPosts =
  (page?: number) =>
  async (dispatch: ThunkDispatch<RootState, void, PostActionTypes>) => {
    dispatch(setFetchingPost(true));
    const res = await getPostsRequest(page);
    dispatch(setPosts(res.posts));
    dispatch(setTotalPost(res.total ?? 0));
    dispatch(setFetchingPost(false));
  };

export const like =
  (id: string) =>
  async (dispatch: ThunkDispatch<RootState, void, PostActionTypes>) => {
    const res = await setLikeRequest(id);
    dispatch(setLike(id));
  };
