# Prisma Database Scripts

This directory contains database seeding and migration scripts for the "I'm Reading Here" book club application.

## Files

- **`seed-data.ts`** - Shared seed data (users, books, clubs)
- **`seed.ts`** - Basic Prisma-only seed script
- **`seed-with-supabase.ts`** - Full seed with Supabase authentication
- **`supabase-sync.ts`** - Supabase user management utility

## Quick Commands

```bash
# Reset and seed everything
pnpm db:reset

# Seed with Supabase
pnpm db:seed:supabase

# Prisma only
pnpm db:seed
```

## Full Documentation

See [Seeding the Database](../../../docs/seeding-the-database.md) for comprehensive documentation, test user credentials, and troubleshooting guides.
