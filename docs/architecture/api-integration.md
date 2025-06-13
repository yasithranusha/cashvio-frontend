# API Integration

## Backend Services Integration

The Cashvio frontend applications consume multiple backend microservices hosted on AWS EC2 instances.

## Service Endpoints

### Authentication Service
- **Base URL**: `http://ec2-51-21-155-1.eu-north-1.compute.amazonaws.com/auth`
- **Purpose**: User authentication, authorization, and session management
- **Consumed by**: All applications (Customer, Shop, Admin)

### Stock Management Service
- **Base URL**: `http://ec2-51-21-155-1.eu-north-1.compute.amazonaws.com/stock`
- **Purpose**: Product inventory, stock levels, and catalog management
- **Consumed by**: Shop Portal, Admin Panel

### Order Processing Service
- **Base URL**: `http://ec2-51-21-155-1.eu-north-1.compute.amazonaws.com/order`
- **Purpose**: Order creation, processing, and management
- **Consumed by**: All applications (Customer, Shop, Admin)

### Mailer Service
- **Base URL**: `http://ec2-51-21-155-1.eu-north-1.compute.amazonaws.com/mailer`
- **Purpose**: Email notifications and communication
- **Consumed by**: Admin Panel

## HTTP Client Configuration

All applications use a custom Axios configuration located in `lib/customAxios.ts` for:
- Request/response interceptors
- Authentication token handling
- Error handling and retry logic
- Base URL configuration per environment

## API Consumption Patterns

### Authentication Flow
```typescript
// Common pattern across all apps
const response = await authAPI.login(credentials);
const token = response.data.token;
// Token stored in session storage/cookies
```

### Stock Management (Shop Portal)
```typescript
// Product management
await stockAPI.createProduct(productData);
await stockAPI.updateStock(productId, quantity);
await stockAPI.getInventory();
```

### Order Processing
```typescript
// Order lifecycle
await orderAPI.createOrder(orderData);
await orderAPI.updateOrderStatus(orderId, status);
await orderAPI.getOrderHistory();
```