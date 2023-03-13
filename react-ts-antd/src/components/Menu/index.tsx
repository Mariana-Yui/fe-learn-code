import { FC, PropsWithChildren } from 'react';
import Menu, { MenuProps } from './menu';
import MenuItem, { MenuItemProps } from './menu-item';
import SubMenu, { SubMenuProps } from './sub-menu';

export type IMenuComponent = FC<PropsWithChildren<MenuProps>> & {
  Item: FC<PropsWithChildren<MenuItemProps>>;
  SubMenu: FC<PropsWithChildren<SubMenuProps>>;
};

const TransMenu = Menu as IMenuComponent;

TransMenu.Item = MenuItem;
TransMenu.SubMenu = SubMenu;

export default TransMenu;
