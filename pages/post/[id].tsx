import Cookies from 'cookies';
import React from 'react';
import { user } from '../../store/reducers/auth/thunks';
import { NextThunkDispatch, wrapper } from '../../store/store';
import { setJwtToken } from '../../utils/setJwtToken';
import { getPost } from '../../store/reducers/post/thunks';

const Post = () => {
  return (
    <div>
      <div>Hi</div>
    </div>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  async ({ store, res, req, ...ctx }) => {
    const cookies = new Cookies(req, res);
    const dispatch = store.dispatch as NextThunkDispatch;
    const token = cookies.get('auth') || null;

    if (!ctx.params?.id) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }
    const valid = await dispatch(setJwtToken(token));
    valid && (await dispatch(await user()));
    valid && (await dispatch(await getPost(ctx.params.id as string)));
    
  },
);

export default Post;
