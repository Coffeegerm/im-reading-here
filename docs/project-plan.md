# Tech Stack

- **Backend**: TypeScript + **NestJS** (or Fastify) with Prisma on Postgres.
- **Search/Books**: Open Library API first (no cost), fall back to Google Books for coverage. Cache normalized Book records.
- **Web**: **Next.js (React)** + TanStack Query, Zod for runtime types, MSW for test mocks
- **Mobile**: **React Native (Expo)**; share UI & query hooks with a monorepo (Turborepo).
- **Auth**: Clerk/Auth0/Supabase Auth; JWT with short TTL + refresh.
- **Realtime**: Socket.io or Supabase Realtime channels for poll:{id} and meeting:{id} rooms.
- **Storage**: S3 (covers, exports).
- **Infra**: Vercel/Netlify for web, Fly.io/Render for API, RDS/Neon for Postgres, Upstash/Redis for rate‑limit & cache.

## **1. Product Scope**


**MVP**

- User authentication (email + password or OAuth).
- User profile with three stable shelves:
    - **TBR** (to be read)
    - **Read**
    - **DNF** (did not finish)

- Book search/import (Open Library or Google Books).
- Clubs (public or invite-only) with roles (owner, admin, member).
- Membership flow (request, approve).
- Meetings (in-person or virtual), timezone-aware scheduling, RSVP.
- Polls/Voting to pick a book.
- Reading plans (same book across multiple meetings).
- Shelf visibility (public, club, private).
- Notifications (email + in-app).


**Phase 2**

- Ranked-choice voting (RCV).
- Reading progress per user.
- Discussion threads & meeting notes.
- Calendar sync (ICS, Google/Outlook).
- Import from Goodreads/StoryGraph.
- Recommendations & realtime chat.

---

## **2. Domain Model**


### **Core Entities**

- **User** → has TBR, Read, DNF shelves.
- **Book** → imported via ISBN/OpenLibrary/Google Books.
- **ShelfItem** → connects a book to a shelf with metadata (rating, review, finished date).
- **Club** → group of users.
- **Membership** → user ↔ club relationship with role & status.
- **Meeting** → tied to a club, can be in-person or virtual, with RSVPs.
- **ReadingPlan** → enforces a book across multiple meetings.
- **Poll** → members propose/vote on books.
- **RSVP** → attendance status.

### **Relationships**

- User → Shelves (1:3 fixed).
- Shelf → ShelfItems (1:N).
- Club → Memberships (1:N).
- Club → Meetings (1:N).
- Meeting → Polls, ReadingPlan.
- Poll → Options → Votes.

---

## **3. Database Schema (Postgres)**

See [database-schema.md]

---

## **4. Voting**

- **MVP**: Approval voting → highest approvals wins.
- **Phase 2**: Ranked Choice (IRV) → store ranks, resolve ties server-side.

---

## **5. Reading Plans**

- Link a book to a sequence of meetings.
- Auto-assigns current_book_id to all meetings in range.
- Prevents conflicting polls unless admins override.

---

## **6. API Design**

**REST**

See [bookclub_rest_api.md]

---

## **7. Permissions**

- Club visibility: public or member-only.
- Shelf visibility: public | club | private.
- Admins can create polls, reading plans, update meetings.
- Members can vote, RSVP, add shelf items.


---

## **8. Tech Stack**

- **Backend**: NestJS (TypeScript) + Prisma + Postgres.
- **Frontend**: Next.js (web), React Native (mobile).
- **Auth**: Clerk/Auth0/Supabase
- **Realtime**: Socket.io or Supabase Realtime.
- **Infra**: Vercel + Fly.io + Neon/Postgres.
- **Testing**: MSW (mock APIs), Playwright (E2E).


---

## **9. Delivery Plan**

- **Week 1–2**: Auth, Users, Books + Shelves.
- **Week 3–4**: Clubs + Memberships.
- **Week 5**: Meetings + RSVP.

- **Week 6**: Polls + voting.

- **Week 7**: Reading plans.

- **Week 8**: Polish, QA, Beta release.


---

## **10. Analytics**

- Track: ClubCreated, PollCreated, Voted, MeetingCreated, ShelfItemAdded.

- KPIs: vote participation, meeting attendance, book completion rates.
