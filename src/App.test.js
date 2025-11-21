import { render, screen } from '@testing-library/react';
import App from './App';

test('shows dashboard greeting after auto login', async () => {
  render(<App />);
  const greeting = await screen.findByText(/Welcome back/i);
  expect(greeting).toBeInTheDocument();
});
