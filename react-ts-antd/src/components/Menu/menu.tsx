import React, { createContext, PropsWithChildren, useState } from 'react';
import classNames from 'classnames';
import { MenuItemProps } from './menu-item';

type MenuMode = 'horizontal' | 'vertical';
type selectCallback = (selectedIndex: string) => void;
export interface MenuProps {
  defaultIndex?: string; //默认索引
  className?: string;
  mode?: MenuMode;
  style?: React.CSSProperties;
  onSelect?: selectCallback;
  defaultOpenSubMenus?: string[];
}

interface IMenuContext {
  index: string;
  onSelect?: selectCallback;
  mode?: MenuMode;
  defaultOpenSubMenus?: string[];
}

export const MenuContext = createContext<IMenuContext>({ index: '0' });
const Menu: React.FC<PropsWithChildren<MenuProps>> = (props) => {
  const { className, mode, style, children, defaultIndex, onSelect, defaultOpenSubMenus } = props;
  const [currentActive, setActive] = useState(defaultIndex);
  const classes = classNames('mariana-menu', className, {
    'menu-vertical': mode === 'vertical',
    'menu-horizontal': mode !== 'vertical',
  });
  const handleClick = (index: string) => {
    setActive(index);
    onSelect?.(index);
  };

  const passedContext: IMenuContext = {
    index: currentActive ?? '0',
    onSelect: handleClick,
    mode: mode,
    defaultOpenSubMenus: defaultOpenSubMenus || [],
  };

  const renderChildren = () => {
    return React.Children.map(children, (children, index) => {
      const childElement = children as React.FunctionComponentElement<MenuItemProps>;
      const { displayName } = childElement.type;
      if (displayName === 'MenuItem' || displayName === 'SubMenu') {
        return React.cloneElement(childElement, {
          index: index.toString(),
        });
      } else {
        console.error('Warning: Menu has a child which is not a MenuItem component');
      }
    });
  };

  return (
    <MenuContext.Provider value={passedContext}>
      <ul className={classes} style={style} data-testid="test-menu">
        {renderChildren()}
      </ul>
    </MenuContext.Provider>
  );
};

Menu.defaultProps = {
  defaultIndex: '0',
  mode: 'horizontal',
};

export default Menu;
