import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import Button, { ButtonProps, ButtonSize, ButtonType } from './button';

const defaultProps = {
  onClick: jest.fn(),
};

const testProps: ButtonProps = {
  btnType: ButtonType.Primary,
  size: ButtonSize.Large,
  className: 'kclass',
};

const disabledProps: ButtonProps = {
  disabled: true,
  onClick: jest.fn(),
};

describe('test Button component', () => {
  it('should render the corrent default button', () => {
    render(<Button {...defaultProps}>Nice</Button>);
    const element = screen.getByText('Nice') as HTMLButtonElement;
    expect(element).toBeInTheDocument();
    expect(element.tagName).toBe('BUTTON');
    expect(element).toHaveClass('btn btn-default');
    expect(element).not.toBeDisabled();
    fireEvent.click(element);
    expect(defaultProps.onClick).toHaveBeenCalled();
  });
  it('should render the current component based on different props', () => {
    render(<Button {...testProps}>Nice</Button>);
    const element = screen.getByText('Nice');
    expect(element).toBeInTheDocument();
    expect(element).toHaveClass('btn', 'btn-lg', 'btn-primary', 'kclass');
  });
  it('should render a link when btnType equals link and href is provided', () => {
    render(
      <Button btnType={ButtonType.Link} href="http://dummyurl">
        Link
      </Button>,
    );
    const element = screen.getByText('Link');
    expect(element).toBeInTheDocument();
    expect(element.tagName).toBe('A');
    expect(element).toHaveClass('btn', 'btn-link');
  });
  it('should render disabled button when disabled set to true', () => {
    render(<Button {...disabledProps}>Nice</Button>);
    const element = screen.getByText('Nice');
    expect(element).toBeInTheDocument();
    expect(element).toBeDisabled();
    fireEvent.click(element);
    expect(disabledProps.onClick).not.toHaveBeenCalled();
  });
});
