import { render, screen, fireEvent } from '@testing-library/react';
import Index from '../app/routes/index';

describe('Index', () => {
  it('renders a heading and a button', () => {
    render(<Index />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('おみくじ');
    expect(screen.getByRole('button', { name: /おみくじを引く/i })).toBeInTheDocument();
  });

  it('displays the omikuji result when the button is clicked', async () => {
    render(<Index />);
    const button = screen.getByRole('button', { name: /おみくじを引く/i });
    fireEvent.click(button);
    const omikujiResult = await screen.findByText(/大吉|中吉|小吉|凶/i); // 結果が非同期で表示されるため、findByText を使用
    expect(omikujiResult).toBeVisible();
  });
});
