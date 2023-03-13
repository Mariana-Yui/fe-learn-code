import React from 'react';
import Button from '@/components/Button';
import Menu from '@/components/Menu';
import { ButtonSize, ButtonType } from '@/components/Button/button';
import '@/styles/index.scss';

function App() {
  return (
    <div className="App">
      <header className="App-header red">
        <h2>Menu</h2>
        <Menu defaultIndex="0" mode="horizontal" onSelect={(index) => alert(index)} defaultOpenSubMenus={['3']}>
          <Menu.Item>cool link 1</Menu.Item>
          <Menu.Item>cool link 2</Menu.Item>
          <Menu.Item>cool link 3</Menu.Item>
          <Menu.SubMenu title="dropdown">
            <Menu.Item>dropdown 1</Menu.Item>
            <Menu.Item>dropdown 2</Menu.Item>
            <Menu.Item>dropdown 3</Menu.Item>
          </Menu.SubMenu>
        </Menu>
        <h2>Button</h2>
        <Button className="custom" disabled>
          Default Disabled Button
        </Button>
        <hr />
        <Button
          onClick={(e) => {
            alert(123);
          }}
          btnType={ButtonType.Primary}
          size={ButtonSize.Large}
        >
          Primary Large Button
        </Button>
        <hr />
        <Button btnType={ButtonType.Danger} size={ButtonSize.Small}>
          Danger Small Button
        </Button>
        <hr />
        <Button btnType={ButtonType.Link} href="https://www.baidu.com" disabled>
          Link Disabled Button
        </Button>
      </header>
    </div>
  );
}

export default App;
