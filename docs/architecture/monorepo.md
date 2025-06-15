# Monorepo Structure

The Cashvio frontend follows a well-organized monorepo structure using Turbo and pnpm workspaces.

## Repository Structure

```
cashvio-frontend/
├── apps/                          # Applications
│   ├── customer/                  # Customer-facing app
│   ├── shops/                     # Shop owner portal
│   └── admin/                     # Admin panel
├── packages/                      # Shared packages
│   ├── ui/                        # Component library
│   ├── eslint-config/             # ESLint configurations
│   └── typescript-config/         # TypeScript configurations
├── docs/                          # Documentation
├── catalog-info.yml              # Backstage catalog
├── mkdocs.yml                    # Documentation config
├── turbo.json                    # Turbo configuration
├── pnpm-workspace.yaml           # pnpm workspace config
└── package.json                  # Root package.json
```

## Applications

### Customer App (`apps/customer`)
- **Purpose**: Customer-facing e-commerce interface
- **Port**: 3000 (development)
- **Dependencies**: @workspace/ui, auth API, order API

### Shop Portal (`apps/shops`)
- **Purpose**: Shop owner management interface
- **Port**: 3001 (development)
- **Dependencies**: @workspace/ui, auth API, stock API, order API

### Admin Panel (`apps/admin`)
- **Purpose**: Platform administration interface
- **Port**: 3002 (development)
- **Dependencies**: @workspace/ui, all backend APIs

## Shared Packages

### UI Library (`packages/ui`)
- Shared React components
- Design system and tokens
- Tailwind CSS configuration
- shadcn/ui integration

### ESLint Config (`packages/eslint-config`)
- Base ESLint rules
- Next.js specific rules
- React internal rules
- Consistent code quality across apps

### TypeScript Config (`packages/typescript-config`)
- Base TypeScript configuration
- Next.js specific config
- React library config
- Shared type definitions

## Workspace Configuration

### pnpm Workspace (`pnpm-workspace.yaml`)
```yaml
packages:
  - "apps/*"
  - "packages/*"
```

### Turbo Configuration (`turbo.json`)
- Build pipeline definitions
- Task dependencies and caching
- Development server orchestration
- Optimized build performance

## Development Workflow

### Installing Dependencies
```bash
# Install for entire monorepo
pnpm install

# Install for specific workspace
pnpm --filter customer add package-name
```

### Running Applications
```bash
# All apps in development
pnpm dev

# Specific app
pnpm --filter customer dev
pnpm --filter shops dev
pnpm --filter admin dev
```

### Building
```bash
# Build all apps
pnpm build

# Build specific app
pnpm --filter customer build
```

## Benefits

### Code Sharing
- Shared UI components across all applications
- Common configurations and tooling
- Consistent design and behavior

### Development Efficiency
- Turbo's intelligent caching
- Parallel task execution
- Hot reloading across dependent packages

### Maintenance
- Single repository for all frontend code
- Unified dependency management
- Consistent versioning and releases