# Customer Application

The Cashvio Customer Application is the customer-facing interface for the e-commerce platform, built with Next.js 15 and React 19.

## Overview

- **URL**: [https://cashvio-customer.vercel.app/](https://cashvio-customer.vercel.app/)
- **Purpose**: Customer browsing, product discovery, and order placement
- **Framework**: Next.js 15 with App Router
- **Deployment**: Vercel

## Features

### Core Functionality
- Product catalog browsing
- User authentication and registration
- Shopping cart management
- Order placement and tracking
- User profile management

### API Integration
- **Auth Service**: User login, registration, and session management
- **Order Service**: Order creation, tracking, and history

## Architecture

```
Customer App
├── Authentication (Auth API)
├── Product Browsing (Static/Cached)
├── Shopping Cart (Local State)
├── Order Management (Order API)
└── User Profile (Auth API)
```

## Key Components

### Authentication Flow
- User registration and login
- JWT token management
- Session persistence
- Password reset functionality

### Shopping Experience
- Product search and filtering
- Category navigation
- Product detail pages
- Shopping cart with real-time updates

### Order Processing
- Checkout flow
- Payment integration
- Order confirmation
- Order tracking and history

## Development

```bash
# Run customer app locally
pnpm --filter customer dev

# Build for production
pnpm --filter customer build
```

## Environment Variables
- `NEXT_PUBLIC_API_URL`: Base URL for API services
- `NEXT_PUBLIC_APP_ENV`: Environment (development, staging, production)