import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from 'components/buttons/Button';
import { vi } from 'vitest';
import { Trash2 } from 'lucide-react';

describe('Button', () => {
  it('renders button text', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('renders an icon if provided', () => {
    render(<Button icon={<Trash2 data-testid="icon" />}>Delete</Button>);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click Me</Button>);
    
    fireEvent.click(screen.getByText('Click Me'));
    expect(onClick).toHaveBeenCalled();
  });

  it('applies custom styles', () => {
    render(<Button styles={{ backgroundColor: 'red' }}>Styled</Button>);
    screen.debug()
    expect(screen.getByRole('button')).toHaveStyle({ backgroundColor: 'red' });
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Styled</Button>);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('is disabled when disabled prop is passed', () => {
    render(<Button disabled={true}>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
