import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChainItem } from '../components/ChainItem';

describe('ChainItem', () => {
  it('renders Ethereum chain correctly', () => {
    render(<ChainItem chainKey="ethereum" />);
    
    expect(screen.getByText('Ethereum')).toBeDefined();
    expect(screen.getByText('E')).toBeDefined();
  });

  it('renders BNB Chain correctly', () => {
    render(<ChainItem chainKey="bnbchain" />);
    
    expect(screen.getByText('BNB Chain')).toBeDefined();
    expect(screen.getByText('B')).toBeDefined();
  });

  it('renders unknown chain with default values', () => {
    render(<ChainItem chainKey="unknown" />);
    
    expect(screen.getByText('unknown')).toBeDefined();
    expect(screen.getByText('?')).toBeDefined();
  });

  it('renders with custom name and icon', () => {
    render(<ChainItem chainKey="ethereum" name="Custom Name" icon="C" />);
    
    expect(screen.getByText('Custom Name')).toBeDefined();
    expect(screen.getByText('C')).toBeDefined();
  });

  it('renders compact variant correctly', () => {
    render(<ChainItem chainKey="ethereum" variant="compact" />);
    
    expect(screen.getByText('Ethereum:')).toBeDefined();
    expect(screen.getByText('E')).toBeDefined();
  });
});