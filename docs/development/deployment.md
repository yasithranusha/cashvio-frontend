# Deployment Guide

This guide covers the deployment process for all Cashvio frontend applications using Vercel.

## Production Deployments

All applications are deployed to Vercel with automatic deployments from the main branch:

- **Customer App**: https://cashvio-customer.vercel.app/
- **Shop Portal**: https://cashvio-shop.vercel.app/
- **Admin Panel**: https://cashvio-admin.vercel.app/

## Vercel Configuration

### Project Setup
Each application has its own Vercel project:
- `cashvio-customer` (Customer App)
- `cashvio-shop` (Shop Portal)
- `cashvio-admin` (Admin Panel)

### Build Configuration
```json
// vercel.json (in each app directory)
{
  "buildCommand": "cd ../.. && pnpm build --filter=customer",
  "devCommand": "cd ../.. && pnpm dev --filter=customer",
  "installCommand": "cd ../.. && pnpm install",
  "outputDirectory": ".next"
}
```

### Environment Variables

#### Production Environment Variables
```bash
# All Apps
NEXT_PUBLIC_API_URL=http://ec2-51-21-155-1.eu-north-1.compute.amazonaws.com
NEXT_PUBLIC_APP_ENV=production

# Customer App
NEXT_PUBLIC_AUTH_API_URL=http://ec2-51-21-155-1.eu-north-1.compute.amazonaws.com/auth
NEXT_PUBLIC_ORDER_API_URL=http://ec2-51-21-155-1.eu-north-1.compute.amazonaws.com/order

# Shop Portal
NEXT_PUBLIC_AUTH_API_URL=http://ec2-51-21-155-1.eu-north-1.compute.amazonaws.com/auth
NEXT_PUBLIC_STOCK_API_URL=http://ec2-51-21-155-1.eu-north-1.compute.amazonaws.com/stock
NEXT_PUBLIC_ORDER_API_URL=http://ec2-51-21-155-1.eu-north-1.compute.amazonaws.com/order

# Admin Panel
NEXT_PUBLIC_AUTH_API_URL=http://ec2-51-21-155-1.eu-north-1.compute.amazonaws.com/auth
NEXT_PUBLIC_STOCK_API_URL=http://ec2-51-21-155-1.eu-north-1.compute.amazonaws.com/stock
NEXT_PUBLIC_ORDER_API_URL=http://ec2-51-21-155-1.eu-north-1.compute.amazonaws.com/order
NEXT_PUBLIC_MAILER_API_URL=http://ec2-51-21-155-1.eu-north-1.compute.amazonaws.com/mailer
```

## Deployment Process

### Automatic Deployments
- **Trigger**: Push to `main` branch
- **Process**: Vercel automatically builds and deploys each app
- **Duration**: ~2-5 minutes per application
- **Rollback**: Previous deployments remain accessible

### Manual Deployments
```bash
# Deploy from CLI (requires Vercel CLI)
vercel --prod

# Deploy specific app
cd apps/customer && vercel --prod
cd apps/shops && vercel --prod
cd apps/admin && vercel --prod
```

### Preview Deployments
- **Trigger**: Pull requests and feature branches
- **URL**: Unique preview URL for each deployment
- **Testing**: Full environment for testing changes

## Build Optimization

### Turbo Cache
Vercel utilizes Turbo's remote caching for faster builds:
- Shared build cache across deployments
- Only rebuilds changed packages
- Significantly reduced build times

### Next.js Optimizations
- **Static Generation**: Pages pre-rendered at build time
- **Image Optimization**: Automatic image optimization
- **Bundle Analysis**: Monitor bundle sizes
- **Edge Functions**: API routes deployed to edge

## Monitoring and Analytics

### Vercel Analytics
- Page load performance
- Core Web Vitals
- User experience metrics
- Real user monitoring

### Error Tracking
- Runtime error monitoring
- Build failure notifications
- Performance degradation alerts

## Domain Configuration

### Custom Domains
Production applications use custom domains:
- Customer: `cashvio-customer.vercel.app`
- Shop: `cashvio-shop.vercel.app`
- Admin: `cashvio-admin.vercel.app`

### SSL/TLS
- Automatic SSL certificate provisioning
- HTTPS enforcement
- Security headers configuration

## Deployment Checklist

### Pre-deployment
- [ ] All tests pass
- [ ] Build succeeds locally
- [ ] Environment variables configured
- [ ] API endpoints accessible
- [ ] Performance benchmarks met

### Post-deployment
- [ ] Applications load correctly
- [ ] Authentication works
- [ ] API integrations functional
- [ ] Performance metrics acceptable
- [ ] Error rates within limits

## Troubleshooting

### Build Failures
- Check build logs in Vercel dashboard
- Verify dependencies and package.json
- Ensure Turbo configuration is correct

### Runtime Errors
- Monitor error rates in Vercel
- Check API endpoint availability
- Verify environment variables

### Performance Issues
- Analyze Core Web Vitals
- Review bundle sizes
- Optimize images and assets