# Trust Wallet App

A Next.js wallet application for managing multi-chain cryptocurrency wallets with testnet balance tracking.

 **[Live Demo](https://trust-wallet-app.vercel.app/)**

## Features

- **Multi-chain wallet generation** (Ethereum, BNB Chain)
- **Testnet balance tracking** (Sepolia, BSC Testnet)
- **Encrypted wallet storage** using Trust Wallet Core
- **Auto-refresh balances** every 2 minutes
- **Redux state management** for balance data
- **Comprehensive testing** with Vitest and Testing Library
- **CI/CD pipeline** with GitHub Actions

## Getting Started

```bash
# Clone the repository
git clone git@github.com:mpallares/trust-wallet-app.git
cd trust-wallet-app

# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Development

### Testing
```bash
pnpm run test     
pnpm run test:ui     
pnpm run test:run      
```

### Building
```bash
pnpm run build
```

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **State Management**: Redux Toolkit
- **Styling**: CSS Modules
- **Wallet Core**: Trust Wallet Core
- **RPC Providers**: PublicNode
- **Testing**: Vitest, Testing Library, jsdom
- **CI/CD**: GitHub Actions with automated testing


## Key Limitations

### Current Issues
- **Local storage only**: Uses browser localStorage for wallet persistence
  - *Impact*: Data lost on device change, no backup or sync across devices
- **Rate limiting risks**: Public RPC endpoints have usage limits
  - *Impact*: Could hit limits with many wallets or concurrent users

## Improvement Roadmap

### Performance Optimizations
1. **Virtual scrolling**
   - Handle 100+ wallets without UI lag

### Scalability Solutions
1. **Database migration path**
   - LocalStorage → Server database
   - Enable data persistence and backup
2. **Pagination system**
   - Load wallets in batches (10-20 at a time)
   - Infinite scroll for large wallet collections

### Security Enhancements
1. **Backend rate limiting**
   - Implement per-user rate limiting
   - Protect against API abuse
2. **Request authentication**
   - Secure RPC proxy endpoints
3. **Encrypted cloud backup**
   - Enable secure wallet backup and sync
   - Cross-device wallet access
4. **Security headers**
   - Content Security Policy (CSP)
   - Prevent XSS and injection attacks