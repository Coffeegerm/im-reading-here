# I'm Reading Here 📚

A modern book club management platform built with TypeScript, NestJS, Next.js, and Prisma.

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+
- Docker & Docker Compose

### Quick Start

1. **Clone and install dependencies**

   ```bash
   git clone <repo-url>
   cd im-reading-here
   pnpm install
   ```

2. **Start the database**

   ```bash
   docker-compose up -d postgres
   ```

3. **Set up the API environment**

   ```bash
   cd apps/api
   cp .env.example .env
   # Edit .env with your database connection details
   ```

4. **Run database migrations**

   ```bash
   cd apps/api
   pnpm db:push
   ```

5. **Start the development servers**

   ```bash
   # From the root directory
   pnpm dev
   ```

This will start:

- API server at http://localhost:3001
- Web frontend at http://localhost:3000
- API documentation at http://localhost:3001/api/docs

6. **Start the mobile app (optional)**

   ```bash
   # From the root directory
   pnpm mobile
   ```

   This will start the Expo development server. You can run the mobile app on:
   - iOS simulator (press `i`)
   - Android emulator (press `a`)
   - Web browser (press `w`)
   - Physical device via Expo Go app (scan QR code)

## Component Development

This project includes a comprehensive Storybook setup for component development and testing:

```bash
# Start Storybook development server
pnpm storybook
# or use any of these shortcuts
pnpm sb      # Short version
pnpm story   # Descriptive
pnpm ui      # UI focused
```

Access Storybook at <http://localhost:6006> to:

- 🎨 Develop components in isolation
- 📚 View auto-generated documentation
- 🌙 Test dark/light theme variants
- 📱 Preview responsive breakpoints
- ♿ Run accessibility checks
- 🎮 Interact with component controls

See [STORYBOOK.md](./STORYBOOK.md) for detailed usage instructions.

## Architecture

This is a monorepo containing

### Apps

- **`apps/api`** - NestJS REST API with Prisma ORM
- **`apps/web`** - Next.js web application
- **`apps/mobile`** - React Native mobile app with Expo

### Packages

- **`packages/shared`** - Shared types, schemas, utilities, and design system

## Design System

This project uses a centralized design system to ensure consistency across web and mobile platforms

- **Shared Tailwind Configuration**: Unified design tokens for colors, spacing, typography
- **Platform-Specific Adaptations**: Web uses CSS variables, mobile uses direct values
- **Design Tokens**: Exportable constants for use in JavaScript/TypeScript
- **Documentation**: See `packages/shared/DESIGN_SYSTEM.md` for detailed usage

```typescript
// Using design tokens in code
import { colors } from '@im-reading-here/shared'
const primaryColor = colors.primary[600]

// Using Tailwind classes (same across platforms)
className="bg-primary-600 text-white rounded-lg p-4"
```

## Tech Stack

- **Backend**: TypeScript + NestJS + Prisma + PostgreSQL
- **Frontend**: Next.js + React + TanStack Query + Tailwind CSS + shadcn/ui
- **Mobile**: React Native + Expo + AsyncStorage
- **Shared**: Supabase authentication across web and mobile
- **UI Components**: shadcn/ui built on Radix UI primitives
- **Component Development**: Storybook with accessibility testing
- **Database**: PostgreSQL with Prisma ORM
- **Monorepo**: Turborepo + pnpm workspaces
- **Development**: Docker Compose for local services

## Development

### Useful Commands

```bash
# Install dependencies
pnpm install

# Start all development servers
pnpm dev

# Start Storybook component library
pnpm storybook

# Build all packages
pnpm build

# Build Storybook for production
pnpm build-storybook

# Run type checking
pnpm type-check

# Run linting
pnpm lint

# Start database services
docker-compose up -d

# Database operations (from apps/api)
pnpm db:push      # Push schema changes
pnpm db:migrate   # Create and run migrations
pnpm db:studio    # Open Prisma Studio
```

### Project Structure

```text
├── apps/
│   ├── api/           # NestJS API server
│   └── web/           # Next.js web app
├── packages/
│   └── shared/        # Shared types and utilities
├── docs/              # Project documentation
└── docker-compose.yml
```

## API Documentation

The API documentation is automatically generated with Swagger and available at:
<http://localhost:3001/api/docs>

## Contributing

1. Create a feature branch
2. Make your changes
3. Run `pnpm type-check` and `pnpm lint`
4. Test your changes
5. Submit a pull request

## License

MIT
