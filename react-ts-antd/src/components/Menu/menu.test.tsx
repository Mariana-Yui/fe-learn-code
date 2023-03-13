/* eslint-disable testing-library/no-container */
/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-render-in-setup */
import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import Menu from './index';
import { MenuProps } from './menu';

const testProps: MenuProps = {
  defaultIndex: '0',
  onSelect: jest.fn(),
  className: 'test',
};

const testVerProps: MenuProps = {
  defaultIndex: '0',
  mode: 'vertical',
};

const generateMenu = (props: MenuProps) => (
  <Menu {...props}>
    <Menu.Item>active</Menu.Item>
    <Menu.Item disabled>disabled</Menu.Item>
    <Menu.Item>xyz</Menu.Item>
    <Menu.SubMenu title="dropdown">
      <Menu.Item>drop1</Menu.Item>
    </Menu.SubMenu>
    {/* <li>4</li> */}
  </Menu>
);

const createStyleFile = () => {
  const cssFile: string = `
    .mariana-submenu {
      display: none;
    }
    .mariana-submenu.menu-opened {
      display: block;
    }
  `;
  const style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = cssFile;
  return style;
};

let menuElement: HTMLElement, activeElement: HTMLElement, disableElement: HTMLElement;
describe('test Menu and MenuItem component', () => {
  beforeEach(() => {
    const { container } = render(generateMenu(testProps));
    container.append(createStyleFile());
    menuElement = screen.getByTestId('test-menu');
    activeElement = screen.getByText('active');
    disableElement = screen.getByText('disabled');
  });
  it('should render correct Menu and MenuItem based on default props', () => {
    expect(menuElement).toBeInTheDocument();
    expect(menuElement).toHaveClass('mariana-menu test');
    // expect(menuElement.getElementsByTagName('li').length).toEqual(3);
    expect(menuElement.querySelectorAll(':scope > li').length).toEqual(4);
    expect(activeElement).toHaveClass('menu-item is-active');
    expect(disableElement).toHaveClass('menu-item is-disabled');
  });
  it('click items should change active and call the right callback', () => {
    const thirdItem = screen.getByText('xyz');
    fireEvent.click(thirdItem);
    expect(thirdItem).toHaveClass('is-active');
    expect(activeElement).not.toHaveClass('is-active');
    expect(testProps.onSelect).toHaveBeenCalledWith('2');
    fireEvent.click(disableElement);
    expect(disableElement).not.toHaveClass('is-active');
    expect(testProps.onSelect).not.toHaveBeenCalledWith('1');
  });
  it('should render vertical mode when mode is set to vertical', () => {
    cleanup();
    // 清除原来render, rerender
    render(generateMenu(testVerProps));
    const menuElement = screen.getByTestId('test-menu');
    expect(menuElement).toHaveClass('menu-vertical');
  });
  it('should show dropdown items when hover on subMenu', async () => {
    expect(screen.queryByText('drop1')).not.toBeVisible();
    const dropdownElement = screen.getByText('dropdown');
    fireEvent.mouseEnter(dropdownElement);
    await waitFor(() => {
      expect(screen.queryByText('drop1')).toBeVisible();
    });
    fireEvent.click(screen.getByText('drop1'));
    expect(testProps.onSelect).toHaveBeenCalledWith('3-0');
    fireEvent.mouseLeave(dropdownElement);
    await waitFor(() => {
      expect(screen.queryByText('drop1')).toBeVisible();
    });
  });
});
