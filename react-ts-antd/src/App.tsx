import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Hello from './components/Hello';
import LikeButton from './components/LikeButton';
import MouseTracker from './components/MouseTracker';
import useURLLoader from './hooks/useURLLoader';

interface IDogResult {
  message: string;
  status: string;
}

interface IThemeProps {
  [key: string]: { color: string; background: string };
}

const theme: IThemeProps = {
  light: {
    color: '#000',
    background: '#eee',
  },
  dark: {
    color: '#fff',
    background: '#222',
  },
};

export const ThemeContext = React.createContext(theme.light);

function App() {
  const [show, setShow] = useState(true);
  const [data, loading] = useURLLoader('https://dog.ceo/api/breeds/image/random', [show]);
  const dogResult = data as IDogResult;
  const [mode, setMode] = useState('light');
  return (
    <ThemeContext.Provider value={theme[mode]}>
      <div className="App">
        <header className="App-header red">
          <img src={logo} className="App-logo" alt="logo" />
          <Hello />
          <LikeButton />
          <p>
            <button onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}>Toggle Theme</button>
          </p>
          <p>
            <button onClick={() => setShow(!show)}>Refresh Dog Pic</button>
          </p>
          <p>{loading ? '读取中 🐶' : <img src={dogResult.message} alt="" />}</p>
        </header>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
