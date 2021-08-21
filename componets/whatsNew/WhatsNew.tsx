import React, { ChangeEvent, useState } from 'react';
import s from './whatsNew.module.css';
import { IoIosArrowDropright } from '@react-icons/all-files/io/IoIosArrowDropright';
import TextareaAutosize from 'react-textarea-autosize';
import { BiImageAdd } from '@react-icons/all-files/bi/BiImageAdd';
import { AiOutlineGif } from '@react-icons/all-files/ai/AiOutlineGif';
import { HiOutlineEmojiHappy } from '@react-icons/all-files/hi/HiOutlineEmojiHappy';
import { BiColorFill } from '@react-icons/all-files/bi/BiColorFill';
import ColoredButton from '../coloredButton/ColoredButton';
import { DebounceInput } from 'react-debounce-input';
import { useDispatch } from 'react-redux';
import { setPost } from '../../store/reducers/post/actions';
import { instance } from '../../store/reducers/api';

interface IProps {}
const WhatsNew: React.FC<IProps> = React.memo(() => {
  const [text, setText] = useState('');
  const [color, setColor] = useState('#ffffff');
  const dispatch = useDispatch();
  const handleChangeColor = (e: ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
  };
  const handleChangeText = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };
  const handlePost = async () => {
    const res = await instance.post('/posts', { content: text, color });
    await dispatch(setPost(res.data));
    setText('');
  };
  return (
    <div className={s.whatsNew} style={{ backgroundColor: color }}>
      <div>
        <div className={s.whatsNew__row}>
          <img
            src={
              'https://images.unsplash.com/photo-1544465544-1b71aee9dfa3?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fHBob3RvfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80'
            }
            className={s.whatsNew__img}
            alt={''}
          />
          <div className={s.whatsNew__text}>
            <TextareaAutosize
              autoFocus
              className={s.whatsNew__textarea}
              placeholder={"What's new, Emma"}
              value={text}
              onChange={(e) => handleChangeText(e)}
            />
            <ColoredButton
              className={s.whatsNew__button}
              height={'40px'}
              width={'40px'}
              onClick={() => handlePost()}
            >
              <IoIosArrowDropright />
            </ColoredButton>
          </div>
        </div>
        <div className={`${s.whatsNew_addContent} shadow`}>
          <ColoredButton height={'20px'} width={'20px'}>
            <AiOutlineGif />
          </ColoredButton>
          <ColoredButton height={'20px'} width={'20px'}>
            <BiImageAdd />
          </ColoredButton>
          <ColoredButton height={'20px'} width={'20px'}>
            <HiOutlineEmojiHappy />
          </ColoredButton>

          <ColoredButton height={'20px'} width={'20px'}>
            <>
              <BiColorFill />
              <DebounceInput
                type={'color'}
                debounceTimeout={50}
                value={color}
                onChange={(e) => handleChangeColor(e)}
              />
            </>
          </ColoredButton>
        </div>
      </div>
    </div>
  );
});
WhatsNew.displayName = 'WhatsNew';
export default WhatsNew;
