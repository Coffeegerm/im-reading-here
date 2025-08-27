# I'm Reading Here 📚

A modern book club management platform built with TypeScript, NestJS, Next.js, and Prisma.

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+
- Docker & Docker Compose

### Quick Start

1. **Clone and install dependencies:**
   ```bash
   git clone <repo-url>
   cd im-reading-here
   pnpm install
   ```

2. **Start the database:**
   ```bash
   docker-compose up -d postgres
   ```

3. **Set up the API environment:**
   ```bash
   cd apps/api
   cp .env.example .env
   # Edit .env with your database connection details
   ```

4. **Run database migrations:**
   ```bash
   cd apps/api
   pnpm db:push
   ```

5. **Start the development servers:**
   ```bash
   # From the root directory
   pnpm dev
   ```

This will start:
- API server at http://localhost:3001
- Web frontend at http://localhost:3000
- API documentation at http://localhost:3001/api/docs

## Architecture

This is a monorepo containing:

### Apps
- **`apps/api`** - NestJS REST API with Prisma ORM
- **`apps/web`** - Next.js web application

### Packages
- **`packages/shared`** - Shared types, schemas, and utilities

## Tech Stack

- **Backend**: TypeScript + NestJS + Prisma + PostgreSQL
- **Frontend**: Next.js + React + TanStack Query + Tailwind CSS
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

# Build all packages
pnpm build

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

```
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
http://localhost:3001/api/docs

## Contributing

1. Create a feature branch
2. Make your changes
3. Run `pnpm type-check` and `pnpm lint`
4. Test your changes
5. Submit a pull request

## License

MIT
