# Database Seeding Guide

This directory contains comprehensive seeding scripts for local development of the "I'm Reading Here" book club application.

## 📂 Files Overview

- **`seed-data.ts`** - Shared seed data including users, books, clubs, and helper functions
- **`seed.ts`** - Basic Prisma-only seed script (no authentication)
- **`seed-with-supabase.ts`** - Full seed script with Supabase authentication integration
- **`supabase-sync.ts`** - Utility for managing Supabase users independently

## 🚀 Quick Start

### For Supabase + Prisma (Recommended)

```bash
# Start Supabase locally
pnpm supabase:start

# Reset database and seed with Supabase auth
pnpm db:reset

# Or seed manually
pnpm db:seed:supabase
```

### For Prisma Only

```bash
# Generate Prisma client and run migrations
pnpm db:migrate

# Seed without authentication
pnpm db:seed
```

## 👥 Test User Credentials

All test users are created with the password: **`password123`**

### Available Test Users

| Email | Name | Plan | Shelves Visibility |
|-------|------|------|-------------------|
| `alice@example.com` | Alice Johnson | Premium | Public |
| `bob@example.com` | Bob Smith | Free | Club |
| `carol@example.com` | Carol Williams | Free | Private |
| `david@example.com` | David Brown | Premium | Club |
| `eve@example.com` | Eve Davis | Free | Public |
| `frank@example.com` | Frank Miller | Premium | Club |

## 📚 Seeded Data

### Books (12 popular titles)

- The Handmaid's Tale by Margaret Atwood
- The Seven Husbands of Evelyn Hugo by Taylor Jenkins Reid
- The Catcher in the Rye by J.D. Salinger
- The Alchemist by Paulo Coelho
- The Lord of the Rings by J.R.R. Tolkien
- The Fault in Our Stars by John Green
- Becoming by Michelle Obama
- Educated by Tara Westover
- A Brief History of Time by Stephen Hawking
- Klara and the Sun by Kazuo Ishiguro
- The Kite Runner by Khaled Hosseini
- Where the Crawdads Sing by Delia Owens

### Book Clubs (5 diverse clubs)

- **Literary Explorers** (Public) - Classic and contemporary literature
- **Sci-Fi & Fantasy Fans** (Public) - Science fiction and fantasy novels
- **Non-Fiction Nerds** (Private) - Educational and biographical reads
- **Local Library Book Club** (Public) - Community-focused discussions
- **Young Adult Enthusiasts** (Private) - YA literature focus

### Generated Content

- **User Shelves**: Core shelves (TBR, READ, DNF, READING) + custom shelves
- **Shelf Items**: Books distributed across user shelves with ratings and reviews
- **Club Memberships**: Realistic membership distributions with roles
- **Meetings**: Past and future meetings with RSVPs
- **Polls & Votes**: Book selection polls with approval and RCV voting
- **Reading Plans**: Multi-meeting book reading schedules

## 🛠 Available Scripts

### Main Seeding Commands

```bash
# Reset and seed everything (recommended)
pnpm db:reset

# Seed with Supabase authentication
pnpm db:seed:supabase

# Seed Prisma only (no auth)
pnpm db:seed
```

### Supabase User Management

```bash
# Create users in Supabase Auth only
pnpm db:create-supabase-users

# Sync users between Supabase and Prisma
pnpm db:sync-supabase-users

# List all users from both systems
npx tsx prisma/supabase-sync.ts list
```

### Database Management

```bash
# Run migrations
pnpm db:migrate

# Open Prisma Studio
pnpm db:studio

# Generate Prisma client
pnpm db:generate

# Push schema changes
pnpm db:push
```

## 🔧 Configuration

### Environment Variables

The seed scripts automatically use local Supabase defaults, but you can override:

```bash
# Supabase Configuration
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Database
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres
```

### Customizing Seed Data

Edit `seed-data.ts` to modify:

- **User profiles**: Change names, emails, plans, or avatar URLs
- **Book catalog**: Add/remove books or update metadata
- **Club definitions**: Modify club names, descriptions, or privacy settings
- **Custom shelf names**: Update the list of available custom shelf names
- **Meeting agendas**: Customize meeting agenda templates

## 📊 Seed Statistics

After running the seed, you'll typically get:

- **6 Users** (3 FREE, 3 PREMIUM plans)
- **12 Books** (diverse genres and popularity)
- **5 Book Clubs** (mix of public/private)
- **~15 Club Meetings** (past and future)
- **~100 Shelf Items** (books on user shelves)
- **~20 Club Memberships** (realistic distributions)
- **~6 Polls** (with votes and options)
- **~3 Reading Plans** (multi-meeting book schedules)

## 🐛 Troubleshooting

### Supabase Connection Issues

```bash
# Check Supabase status
npx supabase status

# Restart Supabase if needed
npx supabase restart
```

### Database Reset Issues

```bash
# If reset fails, manually clean and migrate
npx prisma migrate reset --force
pnpm db:seed:supabase
```

### User Authentication Issues

```bash
# Check user sync status
npx tsx prisma/supabase-sync.ts list

# Re-sync users
pnpm db:sync-supabase-users
```

### Performance Issues

The seed scripts are designed to be fast but if you experience slowness:

- Reduce the number of books per shelf in `seed.ts`
- Limit the number of meetings per club
- Decrease the complexity of vote generation

## 🔄 Resetting Data

### Complete Reset (Recommended)

```bash
pnpm db:reset
```

This command will:

1. Reset Prisma migrations
2. Clear all database data
3. Run migrations
4. Execute the full Supabase seed

### Partial Reset

```bash
# Just re-run seeding (keeps schema)
pnpm db:seed:supabase

# Or clean Prisma data only
npx prisma migrate reset --skip-seed
pnpm db:seed
```

## 🎯 Development Tips

### Testing Different User Types

- **Alice** (Premium, Public shelves) - Test premium features and public visibility
- **Bob** (Free, Club shelves) - Test free plan limitations
- **Carol** (Free, Private shelves) - Test privacy settings
- **David** (Premium, Club owner) - Test club management features

### Testing Club Features

- Join **Literary Explorers** (public) to test open club features
- Request access to **Non-Fiction Nerds** (private) to test approval flows
- Use **David's** account to test club ownership and admin features

### Testing Meeting Features

- Check **past meetings** for testing historical data and reviews
- RSVP to **future meetings** to test attendance tracking
- Create new meetings to test scheduling features

### Testing Voting Features

- Participate in **open polls** to test voting interfaces
- Check **closed polls** to test results display
- Test both **approval** and **RCV** voting methods

## 📝 Notes

- All timestamps are generated relative to the current date for realistic testing
- Book covers use Open Library URLs for consistent availability
- Custom shelf limits respect the FREE (2) vs PREMIUM (unlimited) plan restrictions
- Meeting times are spread across reasonable past/future windows
- RSVP and voting participation rates are randomized but realistic (70-80%)

## 🤝 Contributing

When adding new seed data:

1. Update `seed-data.ts` with new content
2. Ensure both `seed.ts` and `seed-with-supabase.ts` handle the changes
3. Test both seeding methods work correctly
4. Update this README with any new features or changes

---

Happy coding! 🚀
