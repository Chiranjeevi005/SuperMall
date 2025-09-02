import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '@/app/page';

// Mock child components to simplify the test
jest.mock('@/components/ShopCard', () => {
  return function MockShopCard() {
    return <div data-testid="shop-card">Shop Card</div>;
  };
});

jest.mock('@/components/ProductCard', () => {
  return function MockProductCard() {
    return <div data-testid="product-card">Product Card</div>;
  };
});

jest.mock('@/components/OfferCard', () => {
  return function MockOfferCard() {
    return <div data-testid="offer-card">Offer Card</div>;
  };
});

describe('Home Page', () => {
  it('renders the home page with all sections', () => {
    render(<Home />);
    
    // Check if the hero section is rendered
    expect(screen.getByText('Welcome to Super Mall')).toBeInTheDocument();
    expect(screen.getByText('Discover amazing products from local merchants in your area')).toBeInTheDocument();
    
    // Check if section headers are rendered
    expect(screen.getByText('Featured Shops')).toBeInTheDocument();
    expect(screen.getByText('Featured Products')).toBeInTheDocument();
    expect(screen.getByText('Current Offers')).toBeInTheDocument();
    
    // Check if view all links are rendered
    expect(screen.getByText('View all shops')).toBeInTheDocument();
    expect(screen.getByText('View all products')).toBeInTheDocument();
    expect(screen.getByText('View all offers')).toBeInTheDocument();
    
    // Check if cards are rendered
    expect(screen.getAllByTestId('shop-card')).toHaveLength(2);
    expect(screen.getAllByTestId('product-card')).toHaveLength(2);
    expect(screen.getAllByTestId('offer-card')).toHaveLength(2);
  });
});