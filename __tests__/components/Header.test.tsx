import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '@/components/Header';

// Mock next/link and next/navigation since they don't work in tests
jest.mock('next/link', () => {
  return ({ children }: { children: React.ReactNode }) => {
    return <div>{children}</div>;
  };
});

jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

describe('Header', () => {
  it('renders the header with navigation links', () => {
    render(<Header />);
    
    // Check if the app name is rendered
    expect(screen.getByText('Super Mall')).toBeInTheDocument();
    
    // Check if navigation links are rendered
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Shops')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Offers')).toBeInTheDocument();
    
    // Check if auth links are rendered
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
  });
});