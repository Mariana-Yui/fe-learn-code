import React, { useContext, useEffect, useRef, useState } from 'react';
import { ThemeContext } from '../App';

const LikeButton: React.FC = () => {
  const [like, setLike] = useState(0);
  const likeRef = useRef(0);
  const domRef = useRef<HTMLInputElement>(null);
  const style = useContext(ThemeContext);

  useEffect(() => {
    document.title = `点击了${like}次`;
  });

  useEffect(() => {
    if (domRef?.current) {
      domRef.current.focus();
    }
  }, [like]);

  const handleAlertClick = () => {
    setTimeout(() => {
      alert('you clicked on ' + likeRef.current);
    }, 3000);
  };

  return (
    <>
      <input type="text" ref={domRef} />
      <button
        style={style}
        onClick={() => {
          setLike(like + 1);
          likeRef.current++;
        }}
      >
        {like} 👍🏻
      </button>
      <button style={style} onClick={handleAlertClick}>
        Alert
      </button>
    </>
  );
};

export default LikeButton;
