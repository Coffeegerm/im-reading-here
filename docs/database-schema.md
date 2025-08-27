```
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

```
