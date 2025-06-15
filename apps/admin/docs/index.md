# Admin Panel

The Cashvio Admin Panel provides comprehensive platform management and oversight capabilities for administrators.

## Overview

- **URL**: [https://cashvio-admin.vercel.app/](https://cashvio-admin.vercel.app/)
- **Purpose**: Platform administration, user management, and system oversight
- **Framework**: Next.js 15 with App Router
- **Deployment**: Vercel

## Features

### User Management
- Customer account administration
- Shop owner account management
- Admin user permissions
- User verification and moderation

### Platform Oversight
- System-wide analytics and reporting
- Revenue and transaction monitoring
- Platform health and performance metrics
- Audit logs and activity tracking

### Content Management
- Global product catalog oversight
- Category and taxonomy management
- Platform-wide promotions and campaigns
- Content moderation and approval

### Communication
- System-wide notifications
- Email campaign management
- Customer support integration
- Announcement distribution

### API Integration
- **Auth Service**: Admin authentication and user management
- **Stock Service**: Global inventory oversight
- **Order Service**: Platform-wide order monitoring
- **Mailer Service**: Email notifications and campaigns

## Architecture

```
Admin Panel
├── Authentication (Auth API)
├── User Management (Auth API)
├── Platform Analytics (All APIs)
├── Content Management (Stock API)
├── Order Oversight (Order API)
└── Communication (Mailer API)
```

## Key Components

### Dashboard
- Real-time platform metrics
- Key performance indicators (KPIs)
- System health monitoring
- Quick action panels

### User Administration
- User account management
- Role-based access control
- Account verification workflows
- User activity monitoring

### Financial Oversight
- Revenue tracking and reporting
- Transaction monitoring
- Payout management
- Financial analytics

### System Management
- Configuration management
- Feature flag controls
- Maintenance scheduling
- Performance optimization

## Development

```bash
# Run admin panel locally
pnpm --filter admin dev

# Build for production
pnpm --filter admin build
```

## Environment Variables
- `NEXT_PUBLIC_API_URL`: Base URL for API services
- `NEXT_PUBLIC_ADMIN_API_URL`: Admin-specific API endpoints
- `NEXT_PUBLIC_MAILER_API_URL`: Mailer service endpoint