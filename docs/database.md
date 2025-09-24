# Database Documentation

This document covers the database setup, architecture, and essential commands for the **I'm Reading Here** project. The application uses **PostgreSQL** as the primary database with **Prisma** as the ORM and **Supabase** for local development and authentication.

## Architecture Overview

### Technology Stack

- **Database**: PostgreSQL 17
- **ORM**: Prisma (with TypeScript client generation)
- **Local Development**: Supabase (containerized PostgreSQL + Auth + API)
- **Authentication**: Supabase Auth (JWT tokens)
- **API**: NestJS with Fastify

### Database Schema Overview

The application follows a normalized relational design with the following core entities:

- **Users**: User profiles with authentication and preferences
- **Books**: Book catalog with metadata from external APIs
- **Shelves**: Core reading lists (TBR, READ, DNF, READING)
- **Custom Shelves**: User-defined book lists
- **Clubs**: Reading groups with members
- **Meetings**: Scheduled club gatherings
- **Polls**: Book voting system with approval/RCV methods
- **Reading Plans**: Multi-meeting book schedules

## Prisma Configuration

### Schema Location

```plaintext
apps/api/prisma/schema.prisma
```

### Key Models

#### User Management

```prisma
model User {
  id               String   @id @default(uuid())
  email            String   @unique
  name             String
  avatarUrl        String?
  plan             String   @default("FREE")  // FREE | PREMIUM
  shelvesVisibleTo String   @default("club")  // public | club | private
}
```

#### Book & Shelf System

```prisma
model Book {
  id            String   @id @default(uuid())
  isbn10        String?
  isbn13        String?
  openlibraryId String?
  title         String
  authors       String[]
  coverUrl      String?
  publishedYear Int?
  subjects      String[]
}

model Shelf {
  id     String    @id @default(uuid())
  userId String
  type   ShelfType // TBR | READ | DNF | READING
}

model CustomShelf {
  id         String  @id @default(uuid())
  userId     String
  name       String
  isArchived Boolean @default(false)
}
```

#### Club System

```prisma
model Club {
  id          String  @id @default(uuid())
  ownerId     String
  name        String
  description String?
  isPublic    Boolean @default(false)
}

model Membership {
  clubId   String
  userId   String
  role     MemberRole   @default(MEMBER) // OWNER | ADMIN | MEMBER
  status   MemberStatus @default(ACTIVE) // ACTIVE | PENDING | BANNED
}
```

## Supabase Configuration

### Local Development Setup

Supabase provides a complete local development stack running in Docker containers:

- **PostgreSQL**: Database server (port 54322)
- **PostgREST API**: Auto-generated REST API (port 54321)
- **Supabase Studio**: Database admin UI (port 54323)
- **Auth Server**: Authentication service
- **Storage**: File storage service

### Configuration File

```plaintext
supabase/config.toml
```

Key settings:

- Project ID: `im-reading-here`
- Database port: `54322`
- API port: `54321`
- PostgreSQL version: `17`

## Essential Commands

### Initial Setup

```bash
# Install dependencies
pnpm install

# Start Supabase local stack
pnpm supabase:start

# Run setup script (recommended for first-time setup)
./setup-supabase.sh
```

### Daily Development

```bash
# Start all services (Supabase + API + Web)
pnpm dev

# Start just the API
pnpm api

# Check Supabase service status
pnpm supabase:status

# Access Supabase Studio (database UI)
pnpm supabase:studio
# Opens: http://127.0.0.1:54323
```

### Database Operations

#### Prisma Commands

```bash
# Generate Prisma client (run after schema changes)
pnpm db:generate

# Create and apply new migration
pnpm db:migrate

# Push schema changes without migration (dev only)
pnpm db:push

# Open Prisma Studio (database browser)
pnpm db:studio

# Seed database with sample data
pnpm db:seed

# Reset database and re-seed
cd apps/api && pnpm db:reset
```

#### Supabase Commands

```bash
# Start Supabase services
pnpm supabase:start

# Stop Supabase services
pnpm supabase:stop

# Restart Supabase services
pnpm supabase:restart

# Reset Supabase database
pnpm supabase:reset

# Check service status and URLs
pnpm supabase:status
```

### Migration Workflow

1. **Modify Schema**: Edit `apps/api/prisma/schema.prisma`
2. **Create Migration**: Run `pnpm db:migrate`
3. **Name Migration**: Provide descriptive name when prompted
4. **Generate Client**: Run `pnpm db:generate`
5. **Update Code**: Modify application code to use new schema
6. **Test Changes**: Verify functionality in development

### Database Seeding

The project includes comprehensive seed data for development:

```bash
# Seed with Supabase auth integration
pnpm db:seed

# Alternative: Basic seed without Supabase
cd apps/api && pnpm db:seed:basic
```

Seed data includes:

- Sample users with different plans (FREE/PREMIUM)
- Popular books from various genres
- Example clubs with memberships
- Scheduled meetings and polls
- Reading plans across multiple meetings

### Database Access

#### Connection URLs

```bash
# Local development
DATABASE_URL="postgresql://postgres:postgres@localhost:54322/postgres"

# Direct connection (when Supabase is running)
psql "postgresql://postgres:postgres@localhost:54322/postgres"
```

#### Admin Access

- **Supabase Studio**: <http://127.0.0.1:54323>
- **Prisma Studio**: Run `pnpm db:studio`
- **PostgreSQL CLI**: Connect via `psql` with URL above

## Troubleshooting

### Common Issues

#### Docker Not Running

```bash
# Error: Docker daemon not running
# Solution: Start Docker Desktop and retry
pnpm supabase:start
```

#### Port Conflicts

```bash
# Error: Port 54322 already in use
# Solution: Stop conflicting services or change ports in supabase/config.toml
pnpm supabase:stop
```

#### Migration Conflicts

```bash
# Error: Migration drift detected
# Solution: Reset and reapply migrations
cd apps/api
npx prisma migrate reset
pnpm db:migrate
```

#### Schema Sync Issues

```bash
# Error: Prisma schema out of sync
# Solution: Generate client and push schema
pnpm db:generate
pnpm db:push
```

### Debugging Queries

```bash
# Enable Prisma query logging in development
# Add to apps/api/.env.local:
DEBUG="prisma:query"

# View slow queries in Supabase Studio
# Navigate to: http://127.0.0.1:54323 > SQL Editor
```

## Production Considerations

### Environment Variables

```bash
# Required for production
DATABASE_URL=           # PostgreSQL connection string
SUPABASE_URL=          # Supabase project URL
SUPABASE_ANON_KEY=     # Supabase anonymous key
SUPABASE_SERVICE_KEY=  # Supabase service role key
```

### Migration Deployment

```bash
# Apply migrations in production
npx prisma migrate deploy

# Generate production client
npx prisma generate
```

### Performance Monitoring

- Use Supabase dashboard for query performance
- Monitor connection pooling metrics
- Set up alerts for slow queries (>100ms)

## Security Best Practices

1. **Row Level Security (RLS)**: Enabled on all user-data tables
2. **JWT Validation**: All API requests validate Supabase JWT tokens
3. **Rate Limiting**: Implemented via Supabase and application middleware
4. **Input Validation**: Prisma schema constraints + Zod validation
5. **Audit Logging**: Track data changes via `createdAt`/`updatedAt` fields

## Backup Strategy

### Local Development

- Supabase containers are ephemeral (data resets on restart)
- Use seed scripts to recreate consistent test data

### Production

- Automated daily backups via Supabase
- Point-in-time recovery available
- Migration rollback procedures documented

---

For additional database-related documentation:

- [Supabase Local Development Guide](./supabase-local-development.md)
- [API Documentation](./bookclub-rest-api.md)
- [Project Plan](./project-plan.md)
