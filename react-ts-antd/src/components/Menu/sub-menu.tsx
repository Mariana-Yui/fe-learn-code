import React, { PropsWithChildren, useContext, useState } from 'react';
import classNames from 'classnames';
import { MenuContext } from './menu';
import { MenuItemProps } from './menu-item';

export interface SubMenuProps {
  index?: string;
  title?: string;
  className?: string;
}

const SubMenu: React.FC<PropsWithChildren<SubMenuProps>> = ({ index, title, children, className }) => {
  const context = useContext(MenuContext);
  const openedSubMenus = context.defaultOpenSubMenus as string[];
  const isOpened = index && context.mode === 'vertical' ? openedSubMenus.includes(index) : false;
  const [menuOpen, setOpen] = useState(isOpened);
  const classes = classNames('menu-item submenu-item', className, {
    'is-active': context.index === index,
  });

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(!menuOpen);
  };
  let timer: any = -1;
  const handleMouse = (e: React.MouseEvent, toggle: boolean) => {
    clearTimeout(timer);
    e.preventDefault();
    timer = setTimeout(() => {
      setOpen(toggle);
    }, 300);
  };
  const clickEvent = context.mode === 'vertical' ? { onClick: handleClick } : {};
  const hoverEvent =
    context.mode !== 'vertical'
      ? {
          onMouseEnter: (e: React.MouseEvent) => handleMouse(e, true),
          onMouseLeave: (e: React.MouseEvent) => handleMouse(e, false),
        }
      : {};
  const renderChild = () => {
    const subMenuClasses = classNames('mariana-submenu', {
      'menu-opened': menuOpen,
    });
    const childrenComponent = React.Children.map(children, (children, i) => {
      const childElement = children as React.FunctionComponentElement<MenuItemProps>;
      if (childElement.type.displayName === 'MenuItem') {
        return React.cloneElement(childElement, {
          index: `${index}-${i}`,
        });
      } else {
        console.error('Warning: Menu has a child which is not a MenuItem component');
      }
    });
    return (
      <ul data-testid="ul" className={subMenuClasses}>
        {childrenComponent}
      </ul>
    );
  };

  return (
    <li key={index} className={classes} {...hoverEvent}>
      <div className="submenu-title" {...clickEvent}>
        {title}
      </div>
      {renderChild()}
    </li>
  );
};

SubMenu.displayName = 'SubMenu';

export default SubMenu;
