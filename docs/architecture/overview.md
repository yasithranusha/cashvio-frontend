# Architecture Overview

## System Architecture

The Cashvio frontend follows a monorepo architecture with three distinct applications sharing common packages and components.

```
cashvio-platform (System)
├── cashvio-frontend-monorepo (Component)
│   ├── cashvio-customer-app (Component)
│   ├── cashvio-shop-app (Component)
│   ├── cashvio-admin-app (Component)
│   └── cashvio-ui-library (Component)
└── Backend Services
    ├── cashvio-auth-api (API)
    ├── cashvio-stock-api (API)
    ├── cashvio-order-api (API)
    └── cashvio-mailer-api (API)
```

## Technology Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **React Version**: React 19 (Release Candidate)
- **TypeScript**: 5.7.3 with strict type checking
- **Styling**: Tailwind CSS with component variants
- **UI Components**: shadcn/ui with Radix UI primitives
- **State Management**: React Hook Form + Zod validation
- **HTTP Client**: Axios with custom interceptors

### Build & Development
- **Monorepo**: Turbo for build orchestration and caching
- **Package Manager**: pnpm with workspace support
- **Linting**: ESLint with shared configurations
- **Formatting**: Prettier for code consistency

### Deployment
- **Platform**: Vercel for all applications
- **CI/CD**: Vercel's built-in deployment pipeline
- **Environment**: Production, staging, and preview deployments

## Component Relationships

### Dependencies
```
Customer App → UI Library → Backend APIs (Auth, Order)
Shop App → UI Library → Backend APIs (Auth, Stock, Order)
Admin App → UI Library → Backend APIs (Auth, Stock, Order, Mailer)
```

### Shared Packages
- `@workspace/ui`: Shared component library
- `@workspace/eslint-config`: ESLint configurations
- `@workspace/typescript-config`: TypeScript configurations