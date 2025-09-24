# Supabase Local Development Guide

This guide walks you through setting up Supabase local development for the Im Reading Here project.

## Prerequisites

- [Docker Desktop](https://docs.docker.com/desktop/) or compatible container runtime
- Node.js 18+ and pnpm
- Git

## Quick Start

### Option 1: Automated Setup (Recommended)

```bash
# Run the setup script
./setup-supabase.sh
```

### Option 2: Manual Setup

1. **Start Supabase local stack:**

   ```bash
   pnpm supabase:start
   ```

2. **Apply database migrations:**

   ```bash
   cd apps/api
   npx prisma migrate deploy
   npx prisma generate
   ```

3. **Seed the database:**

   ```bash
   pnpm db:seed
   ```

4. **Start the development servers:**

   ```bash
   # Option A: Start everything at once
   pnpm dev:full

   # Option B: Start individually
   pnpm api      # API server on :3001
   pnpm web      # Web app on :3000
   pnpm mobile   # Mobile app
   ```

## Available Services

Once Supabase is running, you'll have access to:

| Service              | URL                                                       | Description                 |
| -------------------- | --------------------------------------------------------- | --------------------------- |
| **Supabase Studio**  | http://127.0.0.1:54323                                    | Database admin interface    |
| **API Gateway**      | http://127.0.0.1:54321                                    | Supabase REST & GraphQL API |
| **PostgreSQL**       | `postgresql://postgres:postgres@127.0.0.1:54322/postgres` | Direct database access      |
| **Inbucket (Email)** | http://127.0.0.1:54324                                    | Local email testing         |
| **Storage**          | http://127.0.0.1:54321/storage/v1                         | File storage API            |

## Development Workflow

### 1. Database Changes

When you modify your Prisma schema:

```bash
cd apps/api
npx prisma migrate dev --name your_migration_name
npx prisma generate
```

### 2. Seeding Data

```bash
# Seed with Supabase-compatible data
pnpm db:seed

# Or create Supabase Auth users first, then seed
cd apps/api
pnpm db:create-supabase-users
pnpm db:seed:supabase
```

### 3. Resetting Database

```bash
# Reset Supabase database completely
pnpm supabase:reset

# Or reset just your application data
cd apps/api
npx prisma migrate reset
```

## Environment Variables

The setup automatically configures these environment files:

### Root `.env.local`

- Supabase URLs and keys
- Database connection string
- JWT secrets

### `apps/api/.env`

- API-specific configuration
- Database URL for Prisma
- Supabase service role key

### `apps/web/.env.local`

- Frontend Supabase configuration
- API URLs

## Useful Commands

```bash
# Supabase Management
pnpm supabase:start     # Start Supabase stack
pnpm supabase:stop      # Stop Supabase stack
pnpm supabase:status    # Check service status
pnpm supabase:restart   # Restart all services
pnpm supabase:studio    # Open Studio (shows URL)

# Database
pnpm db:migrate         # Run Prisma migrations
pnpm db:seed           # Seed database
pnpm db:studio         # Open Prisma Studio
cd apps/api && npx prisma studio  # Alternative

# Development
pnpm dev:full          # Start Supabase + all apps
pnpm dev               # Start apps only (assumes Supabase running)
pnpm api               # Start API server only
pnpm web               # Start web app only
```

## Authentication Flow

With Supabase local development:

1. **User Registration**: Users sign up via Supabase Auth
2. **Database Trigger**: Our trigger automatically creates default shelves
3. **JWT Tokens**: Supabase handles JWT creation/validation
4. **API Integration**: Your NestJS API validates Supabase JWTs

### Testing Authentication

1. Visit Supabase Studio → Authentication → Users
2. Create test users or use seeded data
3. Test login/signup flows in your web app
4. Check email confirmations in Inbucket (http://127.0.0.1:54324)

## Troubleshooting

### Supabase won't start

```bash
# Check Docker is running
docker info

# Clean up and restart
pnpm supabase:stop
docker system prune
pnpm supabase:start
```

### Database connection issues

```bash
# Check services are running
pnpm supabase:status

# Verify environment variables
cat apps/api/.env | grep DATABASE_URL
```

### Migration conflicts

```bash
# Reset and reapply migrations
cd apps/api
npx prisma migrate reset
npx prisma migrate deploy
```

### Port conflicts

If you get port conflicts, you can change ports in `supabase/config.toml`:

```toml
[api]
port = 54321

[db]
port = 54322
```

## Production vs Local

| Environment    | Database                  | Auth                | Storage                |
| -------------- | ------------------------- | ------------------- | ---------------------- |
| **Local**      | Supabase Local PostgreSQL | Supabase Local Auth | Supabase Local Storage |
| **Production** | Supabase Cloud            | Supabase Cloud      | Supabase Cloud         |

Switch between environments by updating the `.env` files with appropriate URLs and keys.

## Next Steps

1. **Set up your frontend**: Use the Supabase client in your Next.js app
2. **Configure RLS**: Set up Row Level Security policies in Supabase Studio
3. **Add Edge Functions**: Create serverless functions for advanced features
4. **Deploy**: Push your local schema to Supabase Cloud when ready

## Additional Resources

- [Supabase Local Development Docs](https://supabase.com/docs/guides/local-development)
- [Prisma with Supabase](https://supabase.com/docs/guides/integrations/prisma)
- [Supabase Auth with Next.js](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
