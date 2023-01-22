import React, { useContext } from 'react';
import { ThemeContext } from '../App';

interface IHelloProps {
  message?: string;
}

const Hello: React.FC<IHelloProps> = (props) => {
  const style = useContext(ThemeContext);
  return <h2 style={style}>{props.message}</h2>;
};

Hello.defaultProps = {
  message: 'Hello React',
};

export default Hello;
