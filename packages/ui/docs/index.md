# Cashvio UI Component Library

The shared UI component library and design system for all Cashvio applications, built with React, TypeScript, and Tailwind CSS.

## Overview

- **Package**: `@workspace/ui`
- **Purpose**: Shared components, design tokens, and UI patterns
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components

## Components

### Core Components
- **Button**: Various button styles and states
- **Input**: Form input components with validation
- **Card**: Container components for content layout
- **Badge**: Status and category indicators
- **Avatar**: User profile images and placeholders

### Data Display
- **DataTable**: Advanced table with sorting, filtering, and pagination
- **DataTableColumnHeader**: Sortable column headers
- **Charts**: Analytics and reporting visualizations
- **Statistics**: Key metric displays

### Navigation
- **Sidebar**: Application navigation component
- **Breadcrumbs**: Page navigation hierarchy
- **Pagination**: Content pagination controls
- **Tabs**: Content organization and switching

### Form Components
- **FormField**: Reusable form field wrapper
- **Select**: Dropdown selection components
- **Checkbox**: Checkbox and radio button controls
- **DatePicker**: Date and time selection

### Feedback
- **Toast**: Notification messages (using Sonner)
- **Dialog**: Modal dialogs and confirmations
- **Alert**: Status messages and warnings
- **Loading**: Loading states and spinners

## Design System

### Typography
- Consistent font families and sizes
- Heading hierarchy (h1-h6)
- Body text variations
- Caption and helper text styles

### Colors
- Primary brand colors
- Semantic colors (success, warning, error)
- Neutral grays for backgrounds and borders
- Dark mode support

### Spacing
- Consistent spacing scale
- Component padding and margins
- Layout grid system

### Shadows and Effects
- Elevation system with box shadows
- Hover and focus states
- Transition animations

## Usage

```typescript
// Import components from the shared library
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { DataTable } from "@workspace/ui/components/datatable";

// Use in your application
export function MyComponent() {
  return (
    <Card>
      <DataTable columns={columns} data={data} />
      <Button variant="primary">Action</Button>
    </Card>
  );
}
```

## Development

### Adding New Components
```bash
# Add a new component using shadcn
pnpm dlx shadcn@latest add [component-name] -c packages/ui

# Components are automatically available in all apps
```

### Building the Library
```bash
# Build the UI library
pnpm --filter @workspace/ui build

# Watch for changes during development
pnpm --filter @workspace/ui dev
```

## Dependencies

### Core Dependencies
- React 19 (Release Candidate)
- TypeScript 5.7.3
- Tailwind CSS
- Radix UI primitives
- Class Variance Authority (CVA)

### Shared Across Applications
- Customer App
- Shop Portal  
- Admin Panel

This library ensures consistent design and behavior across all Cashvio applications while maintaining type safety and accessibility standards.