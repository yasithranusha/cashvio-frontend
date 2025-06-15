# Shop Portal

The Cashvio Shop Portal is the interface for shop owners to manage their business operations, inventory, and orders.

## Overview

- **URL**: [https://cashvio-shop.vercel.app/](https://cashvio-shop.vercel.app/)
- **Purpose**: Shop management, inventory control, and order processing
- **Framework**: Next.js 15 with App Router
- **Deployment**: Vercel

## Features

### Inventory Management
- Product catalog management
- Stock level tracking and alerts
- Low stock highlighting (stock < keeping units)
- Supplier management
- Category and subcategory organization

### Order Management
- Order processing and fulfillment
- Order status updates
- Customer communication
- Order history and analytics

### Business Analytics
- Sales reporting
- Inventory analytics
- Customer insights
- Performance metrics

### API Integration
- **Auth Service**: Shop owner authentication and authorization
- **Stock Service**: Product and inventory management
- **Order Service**: Order processing and tracking

## Architecture

```
Shop Portal
├── Authentication (Auth API)
├── Product Management (Stock API)
├── Inventory Control (Stock API)
├── Order Processing (Order API)
└── Analytics Dashboard
```

## Key Components

### Product Management
- Product creation and editing
- Image upload and management
- Pricing and variants
- Category assignment
- Stock keeping units (SKU) management

### Inventory Control
- Real-time stock tracking
- Low stock alerts and highlighting
- Bulk stock updates
- Supplier integration
- Purchase order management

### Order Fulfillment
- Order queue management
- Status tracking
- Shipping integration
- Customer notifications

## Development

```bash
# Run shop portal locally
pnpm --filter shops dev

# Build for production
pnpm --filter shops build
```

## Environment Variables
- `NEXT_PUBLIC_API_URL`: Base URL for API services
- `NEXT_PUBLIC_STOCK_API_URL`: Stock service endpoint
- `NEXT_PUBLIC_ORDER_API_URL`: Order service endpoint