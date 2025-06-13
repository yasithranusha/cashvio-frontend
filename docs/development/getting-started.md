# Getting Started

This guide will help you set up the Cashvio frontend monorepo for development.

## Prerequisites

- **Node.js**: Version 18+ (recommended: 20+)
- **pnpm**: Version 8+ (package manager)
- **Git**: Version control

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yasithranusha/cashvio-frontend.git
cd cashvio-frontend
```

### 2. Install Dependencies
```bash
# Install pnpm globally if not already installed
npm install -g pnpm

# Install all dependencies
pnpm install
```

### 3. Environment Configuration
Create environment files for each application:

#### Customer App
```bash
# apps/customer/.env.local
NEXT_PUBLIC_API_URL=http://ec2-51-21-155-1.eu-north-1.compute.amazonaws.com
NEXT_PUBLIC_AUTH_API_URL=http://ec2-51-21-155-1.eu-north-1.compute.amazonaws.com/auth
NEXT_PUBLIC_ORDER_API_URL=http://ec2-51-21-155-1.eu-north-1.compute.amazonaws.com/order
```

#### Shop Portal
```bash
# apps/shops/.env.local
NEXT_PUBLIC_API_URL=http://ec2-51-21-155-1.eu-north-1.compute.amazonaws.com
NEXT_PUBLIC_AUTH_API_URL=http://ec2-51-21-155-1.eu-north-1.compute.amazonaws.com/auth
NEXT_PUBLIC_STOCK_API_URL=http://ec2-51-21-155-1.eu-north-1.compute.amazonaws.com/stock
NEXT_PUBLIC_ORDER_API_URL=http://ec2-51-21-155-1.eu-north-1.compute.amazonaws.com/order
```

#### Admin Panel
```bash
# apps/admin/.env.local
NEXT_PUBLIC_API_URL=http://ec2-51-21-155-1.eu-north-1.compute.amazonaws.com
NEXT_PUBLIC_AUTH_API_URL=http://ec2-51-21-155-1.eu-north-1.compute.amazonaws.com/auth
NEXT_PUBLIC_STOCK_API_URL=http://ec2-51-21-155-1.eu-north-1.compute.amazonaws.com/stock
NEXT_PUBLIC_ORDER_API_URL=http://ec2-51-21-155-1.eu-north-1.compute.amazonaws.com/order
NEXT_PUBLIC_MAILER_API_URL=http://ec2-51-21-155-1.eu-north-1.compute.amazonaws.com/mailer
```

## Development

### Start All Applications
```bash
# Start all apps simultaneously
pnpm dev
```

This will start:
- Customer App: http://localhost:3000
- Shop Portal: http://localhost:3001
- Admin Panel: http://localhost:3002

### Start Individual Applications
```bash
# Customer app only
pnpm --filter customer dev

# Shop portal only
pnpm --filter shops dev

# Admin panel only
pnpm --filter admin dev
```

### Working with the UI Library
```bash
# Build UI library (required for apps to work)
pnpm --filter @workspace/ui build

# Watch UI library for changes
pnpm --filter @workspace/ui dev
```

## Common Commands

### Building
```bash
# Build all applications
pnpm build

# Build specific application
pnpm --filter customer build
pnpm --filter shops build
pnpm --filter admin build
```

### Linting
```bash
# Lint all code
pnpm lint

# Lint specific application
pnpm --filter customer lint
```

### Type Checking
```bash
# Type check all applications
pnpm type-check

# Type check specific application
pnpm --filter customer type-check
```

### Adding Dependencies
```bash
# Add to specific workspace
pnpm --filter customer add package-name
pnpm --filter @workspace/ui add package-name

# Add to root workspace
pnpm add -w package-name
```

## Troubleshooting

### Port Conflicts
If ports are already in use, you can specify different ports:
```bash
pnpm --filter customer dev -- --port 3010
```

### Dependency Issues
If you encounter dependency issues:
```bash
# Clean and reinstall
rm -rf node_modules apps/*/node_modules packages/*/node_modules
pnpm install
```

### Build Errors
Ensure the UI library is built before starting applications:
```bash
pnpm --filter @workspace/ui build
pnpm dev
```

## Next Steps

1. Explore the codebase structure
2. Review the component library in `packages/ui`
3. Check out the API integration patterns
4. Start developing your features!