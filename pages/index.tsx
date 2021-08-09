import React from 'react';
import axios from 'axios';
import { IPosts } from '../types/IPosts.types';
import { GetStaticPropsContext } from 'next';
import dynamic from 'next/dynamic';
import s from './index.module.css';

const Post = dynamic(() => import('../componets/post/Post'));
const Navbar = dynamic(() => import('../componets/navbar/Navbar'));
const WhatsNew = dynamic(() => import('../componets/whatsNew/WhatsNew'));

interface IProps {
  posts: IPosts[];
}

const Index = ({ posts }: IProps) => {
  return (
    <div>
      <Navbar />
      <div className={s.content}>
        <div className={s.center_block}>
          <div className={s.center_block__whatsnew}>
            <WhatsNew />
          </div>
          <div className={s.center_block__posts}>
            {posts?.map((post) => (
              <Post key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = async (ctx: GetStaticPropsContext) => {
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjdmZjA1Yjc0LThhZTQtNDlkNS1iN2E3LTA3YzhmYTZkZjdiYyIsImxvZ2luIjoiUmVhWnp5RkFLRTEiLCJpYXQiOjE2Mjg1MzU0NTcsImV4cCI6MTYyODYyMTg1N30.zRKBLsxbI8jKC-kDOBPdzx61xfNXdFeRQC0qRwyrC4A';
  const res = await axios.get('http://localhost:4000/posts?page=1', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return {
    props: {
      posts: [...res.data.posts],
    },
  };
};

export default Index;
