# CASHVIO frontend monorepo

This contain frontends for customer, admin and Shops for cashvio application

This monorepo contains three Next.js applications:

- `admin`: Admin panel for managing the platform
- `customer`: Customer-facing application
- `shops`: Shop owner interface

## Getting Started

### Prerequisites

Make sure you have pnpm installed:

```bash
# Using npm
npm install -g pnpm

# Using homebrew on macOS
brew install pnpm
```

### Installation

```bash
# Install all dependencies
pnpm install
```

### Running the applications

```bash
# Start all applications
pnpm dev

# Run a specific application
pnpm --filter admin dev
pnpm --filter customer dev
pnpm --filter shops dev
```

## Adding components

To add components to any of the apps, run the following command:

```bash
pnpm dlx shadcn@latest add button -c apps/admin
pnpm dlx shadcn@latest add button -c apps/customer
pnpm dlx shadcn@latest add button -c apps/shops
```

This will place the ui components in the `packages/ui/src/components` directory.

```tsx
import { Button } from "@workspace/ui/components/button";
```
