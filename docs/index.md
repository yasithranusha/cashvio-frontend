# Cashvio Frontend Monorepo

Welcome to the Cashvio Frontend Monorepo documentation. This repository contains all frontend applications and shared packages for the Cashvio e-commerce platform.

## Overview

Cashvio is a comprehensive e-commerce platform with three main frontend applications:

- **Customer App**: Customer-facing application for browsing and purchasing products
- **Shop Portal**: Interface for shop owners to manage their inventory, orders, and business
- **Admin Panel**: Administrative interface for platform management and oversight

## Architecture

This monorepo is built with:

- **Framework**: Next.js 15 with React 19
- **Build System**: Turbo for efficient builds and caching
- **Package Manager**: pnpm for fast, efficient dependency management
- **UI Components**: Shared component library with shadcn/ui
- **Styling**: Tailwind CSS for consistent design

## Quick Start

```bash
# Install dependencies
pnpm install

# Start all applications in development
pnpm dev

# Start a specific application
pnpm --filter customer dev
pnpm --filter shops dev
pnpm --filter admin dev
```

## Live Applications

- [Customer App](https://cashvio-customer.vercel.app/) - Customer-facing e-commerce interface
- [Shop Portal](https://cashvio-shop.vercel.app/) - Shop owner management interface
- [Admin Panel](https://cashvio-admin.vercel.app/) - Platform administration interface

## Backend Integration

Our frontend applications integrate with the following backend services:

- **Auth Service**: Authentication and authorization
- **Stock Service**: Product inventory management
- **Order Service**: Order processing and management
- **Mailer Service**: Email notifications and communications

## Team

- **Owner**: frontend-team
- **System**: cashvio-platform
- **Related Teams**: backend-team, infrastructure-team, team-cashvio