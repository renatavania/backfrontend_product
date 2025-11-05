import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock react-router-dom to avoid module resolution issues in the test environment
jest.mock(
  'react-router-dom',
  () => ({
    BrowserRouter: ({ children }) => <div>{children}</div>,
    Routes: ({ children }) => <>{children}</>,
    Route: ({ element }) => element,
    useNavigate: () => jest.fn(),
    Link: ({ children, to }) => <a href={to}>{children}</a>,
    Navigate: ({ to }) => <a href={to} />, 
  }),
  { virtual: true }
);

// Mock axios so modules that import an axios instance don't pull the ESM axios package into Jest
jest.mock('axios', () => ({
  create: () => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  }),
}));

// Mock sweetalert2 to avoid injecting CSS into jsdom during tests
jest.mock('sweetalert2', () => ({
  fire: jest.fn(),
}));

import App from './App';

test('renders login heading', () => {
  render(<App />);
  const heading = screen.getByRole('heading', { name: /login/i });
  expect(heading).toBeInTheDocument();
});
