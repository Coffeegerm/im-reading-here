# Im Reading Here Project Plan

## Tech Stack

- **Backend**: TypeScript + NestJS (Fastify) + Prisma on PostgreSQL
- **Frontend**: Next.js (React) + TanStack Query + Tailwind CSS + shadcn/ui
- **UI Components**: shadcn/ui built on Radix UI primitives with CVA
- **Component Development**: Storybook 9+ with accessibility testing & auto-docs
- **Search/Books**: Open Library API → Google Books fallback, cached locally
- **Auth**: Clerk / Auth0 / Supabase Auth (JWT, short TTL + refresh)
- **Realtime**: Socket.io or Supabase Realtime (polls, meetings)
- **Storage**: S3 (covers, exports)
- **Infra**: Vercel (web), Fly.io/Render (API), Neon/PostgreSQL (DB), Upstash/Redis (cache + rate limit)
- **Testing**: Vitest/Jest, Supertest, MSW, Playwright (web E2E), Detox (mobile E2E)
- **Mobile**: React Native (Expo), shared code via Turborepo

## Product Scope

### MVP

- Authentication
- User profile with 3 core shelves: TBR, READ, DNF
- Custom lists:
  - Free = 2 active
  - Premium = unlimited
- Book search/import
- Clubs (public or invite-only) with roles (owner, admin, member)
  - Free = 2 active clubs created/admined
  - Premium = unlimited
- Membership join/request flow
- Meetings (in-person/virtual, RSVP, timezone)
- Polls/voting (approval)
- Reading plans (single-book across meetings)
- Shelf visibility (public | club | private)
- Notifications (email + in-app)

### Phase 2

- Ranked-choice voting (RCV)
- Reading progress tracking
- Discussion threads, notes
- Calendar sync (ICS/Google/Outlook)
- Goodreads/StoryGraph import
- Recommendations & realtime chat

## Component Development

### UI System

The application uses a comprehensive design system built with:

- **shadcn/ui**: Pre-built accessible components using Radix UI primitives
- **Tailwind CSS**: Utility-first styling with design tokens
- **Class Variance Authority (CVA)**: Type-safe component variants
- **Storybook**: Isolated component development and testing

### Current Components

**Core Book Club Components:**

- `BookCard`: Displays book information with ratings, shelves, and actions
- `ClubCard`: Shows club details with member count and meeting information
- `MeetingCard`: Meeting details with RSVP functionality

**UI Primitives (shadcn/ui):**

- `Button`: Multiple variants (default, destructive, outline, secondary, ghost, link)
- `Card`: Structured content container with header/content/footer
- `Badge`: Status indicators and labels
- `Avatar`: User profile images with fallback initials
- `Separator`: Visual content dividers

### Storybook Features

- **Auto-generated Documentation**: Component props and usage examples
- **Accessibility Testing**: Built-in a11y addon for WCAG compliance
- **Theme Testing**: Dark/light mode preview and validation
- **Responsive Testing**: Mobile, tablet, desktop viewport simulation
- **Interactive Controls**: Real-time prop manipulation
- **Visual Regression**: Screenshot comparisons for UI consistency

Access the component library at `http://localhost:6006` during development.

2. Domain Model

- User — has core + custom shelves
- Book — normalized from external providers
- ShelfItem — book + metadata (rating, review, finished date)
- Club — group of users
- Membership — role + status
- Meeting — linked to club, has RSVPs
- ReadingPlan — enforce book across multiple meetings
- Poll — members propose/vote on books
- RSVP — attendance status

3. Database Schema (Postgres)

-- Users
create table users (
  id uuid primary key,
  email text unique not null,
  name text not null,
  avatar_url text,
  plan text not null default 'FREE', -- FREE | PREMIUM
  shelves_visible_to text not null default 'club' -- public|club|private
);

-- Core shelves
create type shelf_type as enum ('TBR','READ','DNF');
create table shelves (
  id uuid primary key,
  user_id uuid references users(id) on delete cascade,
  type shelf_type not null,
  unique (user_id, type)
);

-- Custom shelves
create table custom_shelves (
  id uuid primary key,
  user_id uuid references users(id) on delete cascade,
  name text not null,
  is_archived boolean not null default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, lower(name))
);

-- Shelf items
create table shelf_items (
  id uuid primary key,
  shelf_id uuid references shelves(id),
  custom_shelf_id uuid references custom_shelves(id),
  book_id uuid references books(id),
  added_at timestamptz default now(),
  rating int check (rating between 1 and 5),
  review text,
  finished_at timestamptz,
  constraint core_or_custom check (
    (shelf_id is not null and custom_shelf_id is null) or
    (shelf_id is null and custom_shelf_id is not null)
  )
);

-- Books
create table books (
  id uuid primary key,
  isbn10 text, isbn13 text,
  openlibrary_id text,
  title text not null,
  authors text[] not null,
  cover_url text,
  published_year int,
  subjects text[]
);

-- Clubs
create table clubs (
  id uuid primary key,
  owner_id uuid references users(id),
  name text not null,
  description text,
  is_public boolean default false
);

create type member_role as enum ('OWNER','ADMIN','MEMBER');
create type member_status as enum ('ACTIVE','PENDING','BANNED');
create table memberships (
  id uuid primary key,
  club_id uuid references clubs(id) on delete cascade,
  user_id uuid references users(id) on delete cascade,
  role member_role default 'MEMBER',
  status member_status default 'ACTIVE',
  joined_at timestamptz default now(),
  unique (club_id, user_id)
);

-- Meetings
create type meeting_mode as enum ('IN_PERSON','VIRTUAL');
create table meetings (
  id uuid primary key,
  club_id uuid references clubs(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz,
  mode meeting_mode not null,
  location text,
  video_link text,
  agenda text,
  current_book_id uuid references books(id)
);

-- Reading plans
create table reading_plans (
  id uuid primary key,
  club_id uuid references clubs(id) on delete cascade,
  book_id uuid references books(id),
  start_meeting_id uuid references meetings(id),
  end_meeting_id uuid references meetings(id)
);

-- Polls & votes
create type poll_status as enum ('OPEN','CLOSED');
create type poll_method as enum ('APPROVAL','RCV');
create table polls (
  id uuid primary key,
  club_id uuid references clubs(id),
  meeting_id uuid references meetings(id),
  created_by uuid references users(id),
  status poll_status default 'OPEN',
  method poll_method default 'APPROVAL'
);

create table poll_options (
  id uuid primary key,
  poll_id uuid references polls(id) on delete cascade,
  book_id uuid references books(id),
  proposer_user_id uuid references users(id),
  unique (poll_id, book_id)
);

create table votes (
  id uuid primary key,
  poll_option_id uuid references poll_options(id),
  voter_user_id uuid references users(id),
  approved boolean,
  rank smallint,
  unique (poll_option_id, voter_user_id)
);

-- RSVPs
create type rsvp_status as enum ('GOING','MAYBE','NO');
create table rsvps (
  id uuid primary key,
  meeting_id uuid references meetings(id),
  user_id uuid references users(id),
  status rsvp_status not null,
  unique (meeting_id, user_id)
);

4. REST API

- /auth/* → login, refresh, logout, OAuth
- /me, /users/:id → profiles
- /users/:id/shelves, /users/:id/custom-shelves → core + custom shelves
- /books, /books/import → search & import
- /clubs → create/list
- /clubs/:id/memberships → join/approve
- /clubs/:id/meetings + /meetings/:id/rsvp
- /clubs/:id/polls, /polls/:id/votes
- /clubs/:id/reading-plans
- /me/notifications, /realtime/token, /uploads/presign

5. Monetization

- Free
  - Core shelves (TBR/READ/DNF)
  - 2 custom lists
  - 2 created/admined clubs
  - Approval voting only
  - Single-meeting reading plans
- Premium ($5–6/mo)
  - Unlimited custom lists
  - Unlimited clubs
  - Ranked-choice voting + insights
  - Multi-meeting reading plans
  - Exports (CSV/ICS)
  - Cosmetic perks (profile flair)
- Future Org Plan
  - Libraries, schools, workplaces
  - Analytics, bulk invites

6. Delivery Roadmap

- Auth, Users, Books, Shelves
- Clubs + Memberships
- Meetings + RSVPs
- Polls + voting
- Reading plans
- QA + Beta release

7. Analytics

- Events: CustomShelfCreated, CustomShelfLimitHit, ClubCreated, MeetingCreated, PollCreated, VoteCast, ReadingPlanCreated
- KPIs: shelf/club limit hits, upgrade funnel, club engagement, book completion

8. Full OpenAPI Spec

👉 See [OpenAPISpec.yaml]
