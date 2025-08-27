📡 REST API — Complete Route Catalog (v1)

Base URL: /api/v1
Auth: Bearer JWT (Authorization: Bearer <token>) unless marked public.
Content: application/json (multipart only for uploads).
Pagination: cursor-based: ?cursor=<opaque>&limit=<1..100> → { data, nextCursor }.
Idempotency (recommended for POST): Idempotency-Key: <uuid>.

Envelopes

Success

{ "data": { /* resource or array */ }, "meta": { "requestId": "uuid", "nextCursor": null } }

Error

{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [{ "path": "body.startsAt", "reason": "must be ISO 8601" }]
  },
  "meta": { "requestId": "uuid" }
}


⸻

1) Health & Misc
	•	GET /health → { status: "ok" } (public)
	•	GET /version → { commit, buildTime, schemaVersion } (public)

⸻

1) Auth
	•	POST /auth/login
Body: { email, password } → 200 { accessToken, refreshToken, user }
	•	POST /auth/refresh
Body: { refreshToken } → 200 { accessToken, refreshToken }
	•	POST /auth/logout
Body: { refreshToken } → 204
	•	POST /auth/providers/:provider/callback (for OAuth)
Path :provider ∈ ["google","apple","github", ...] → same as login success

⸻

2) Users & Profiles
	•	GET /me → authenticated user (includes visibility prefs)
	•	PATCH /me
Body (partial): { name?, avatarUrl?, shelvesVisibleTo? /* "public"|"club"|"private" */ }
	•	GET /users/:id → public profile, respects visibility
	•	GET /users/:id/clubs?cursor&limit → clubs they belong to (visibility-aware)
	•	GET /users/:id/activity?cursor&limit&type=club|poll|meeting|shelf → recent activity feed (future-friendly)

⸻

3) Shelves & Shelf Items

Each user has three fixed shelves: TBR, READ, DNF.
	•	GET /users/:id/shelves →
{ tbr: Shelf, read: Shelf, dnf: Shelf } (lists include nextCursor)
	•	GET /users/:id/shelves/:type/items?cursor&limit
:type ∈ TBR|READ|DNF
	•	POST /me/shelves/:type/items
Body: { bookId } → 201 { shelfItem } (idempotent per (shelf, book))
	•	PATCH /me/shelf-items/:itemId
Body: { moveToType?, rating?, review?, finishedAt? }
	•	DELETE /me/shelf-items/:itemId → 204

⸻

4) Books (catalog + import)
	•	GET /books/:id → one book (local record)
	•	GET /books?q=&author=&cursor&limit → search (local index)
	•	POST /books/import
Body: { isbn13? , isbn10?, openLibraryId? }
→ Normalize & upsert into local books table, hydrate title, authors, coverUrl.
	•	GET /books/:id/availability (optional) → providers/links (Amazon, library, etc.)

⸻

5) Clubs
	•	POST /clubs
Body: { name, description?, isPublic? } → 201 { club }
	•	GET /clubs?mine=true|false&q=&cursor&limit → discover/list
	•	GET /clubs/:id → details (gates by isPublic or membership)
	•	PATCH /clubs/:id (owner/admin)
Body: { name?, description?, isPublic? }
	•	DELETE /clubs/:id (owner) → 204

Memberships
	•	GET /clubs/:id/members?cursor&limit&role=OWNER|ADMIN|MEMBER → list
	•	POST /clubs/:id/memberships
Body: { action: "join"|"request" } → auto-approve if isPublic
	•	PATCH /clubs/:id/memberships/:userId (admin/owner)
Body: { role?: "ADMIN"|"MEMBER", status?: "ACTIVE"|"BANNED" }
	•	DELETE /clubs/:id/memberships/:userId (admin/owner or self-leave) → 204

⸻

6) Meetings
	•	GET /clubs/:id/meetings?cursor&limit&when=upcoming|past → list
	•	POST /clubs/:id/meetings
Body:

{
  "startsAt":"2025-09-01T23:00:00Z",
  "endsAt":"2025-09-02T00:00:00Z",
  "mode":"IN_PERSON|VIRTUAL",
  "location":"123 Main St", "videoLink": "https://...",
  "agenda":"Ch. 1–5 discussion",
  "currentBookId": "uuid?"  // optional, else derived by ReadingPlan
}


	•	GET /meetings/:id
	•	PATCH /meetings/:id (admin/owner) — same fields as create
	•	DELETE /meetings/:id (admin/owner) → 204

RSVPs
	•	POST /meetings/:id/rsvp
Body: { status: "GOING"|"MAYBE"|"NO" } → 200
	•	GET /meetings/:id/attendees?cursor&limit → list with statuses

⸻

7) Polls & Voting
	•	GET /clubs/:id/polls?status=OPEN|CLOSED&cursor&limit
	•	POST /clubs/:id/polls (admin by default; configurable)
Body: { meetingId?: "uuid", method?: "APPROVAL"|"RCV" } → 201 { poll }
	•	GET /polls/:id
	•	PATCH /polls/:id (admin)
Body: { status?: "OPEN"|"CLOSED" } (closing triggers tally if OPEN→CLOSED)

Poll Options
	•	POST /polls/:id/options
Body: { bookId } → 201 { option }
	•	DELETE /polls/:id/options/:optionId (admin or proposer before any votes) → 204

Votes
	•	POST /polls/:id/votes
	•	APPROVAL (MVP): Body { optionId, approve: true|false }
Idempotent per voter/option; approve=false removes approval.
	•	RCV (Phase 2): Body { rankings: [{ optionId, rank }] }
	•	POST /polls/:id/close (admin) → 200 { winningBookId, rounds? }
	•	Approval: highest approvals, server returns tie-break details.
	•	IRV: include rounds array for transparency.
	•	GET /polls/:id/results → live aggregate (no per-voter leak unless role allows)

⸻

8) Reading Plans
	•	POST /clubs/:id/reading-plans (admin)
Body: { bookId, startMeetingId, endMeetingId }
Behavior: validates chronological range; sets each meeting’s currentBookId; disables conflicting polls in range.
	•	GET /clubs/:id/reading-plans/:planId
	•	PATCH /clubs/:id/reading-plans/:planId
Body: { startMeetingId?, endMeetingId?, cancel?: true }
If resized/canceled, update affected meetings.
	•	GET /clubs/:id/reading-plans?cursor&limit → history

⸻

9) Notifications (in-app + email)
	•	GET /me/notifications?cursor&limit
Returns recent events (invites, poll opened/closed, RSVP reminders)
	•	POST /me/notifications/:id/read → 204
	•	POST /me/notifications/read-all → 204
	•	PATCH /me/settings/notifications
Body: toggles such as { email: { pollOpen:true, pollClose:true, meetingReminder:true } }

⸻

10) Realtime (auth for sockets)
	•	POST /realtime/token
Body: { channels: ["poll:uuid","meeting:uuid"] } → { token, expiresAt }
Use with Socket.io/Supabase Realtime to join rooms.

⸻

11) Files / Uploads (covers, exports)
	•	POST /uploads/presign
Body: { type: "image/jpeg", purpose: "cover|avatar|export" }
→ { url, fields, uploadUrl, assetUrl } (S3 presign)
	•	POST /exports/clubs/:id/ics → generate ICS; returns { url }

⸻

12) Admin / Moderation (optional, v1 light)
	•	GET /admin/users?cursor&limit&q= (role-gated)
	•	PATCH /admin/users/:id → set roles / ban
	•	GET /admin/clubs?cursor&limit&q=
	•	PATCH /admin/clubs/:id → lock/unlock, set visibility

⸻

13) Query Parameters (standardized)
	•	?cursor=<opaque>
	•	?limit=20 (1..100)
	•	?q=<text> (search)
	•	Common sort enums where relevant, e.g. ?sort=createdAt_desc|startsAt_asc

⸻

14) Status Codes Cheatsheet
	•	200 OK | 201 Created | 204 No Content
	•	400 Validation | 401 Unauthorized | 403 Forbidden | 404 Not Found
	•	409 Conflict (e.g., duplicate poll option) | 422 Unprocessable (semantic rules)
	•	429 Rate limited | 500 Server

⸻

15) Sample Payloads

Club

{
  "id":"c_123",
  "name":"Sci-Fi Readers",
  "description":"We read speculative fiction",
  "isPublic":false,
  "ownerId":"u_1",
  "membersCount":42,
  "createdAt":"2025-08-01T12:00:00Z",
  "updatedAt":"2025-08-10T12:00:00Z"
}

Meeting

{
  "id":"m_123",
  "clubId":"c_123",
  "startsAt":"2025-09-01T23:00:00Z",
  "endsAt":"2025-09-02T00:00:00Z",
  "mode":"VIRTUAL",
  "location":null,
  "videoLink":"https://meet.example/abc",
  "agenda":"Ch. 1–5",
  "currentBookId":"b_777"
}

Poll (APPROVAL)

{
  "id":"p_123",
  "clubId":"c_123",
  "meetingId":"m_123",
  "status":"OPEN",
  "method":"APPROVAL",
  "options":[
    { "id":"po_1","bookId":"b_1","approvals":5 },
    { "id":"po_2","bookId":"b_2","approvals":3 }
  ],
  "createdBy":"u_1",
  "createdAt":"2025-08-20T12:00:00Z"
}


⸻

16) Validation Rules (high-value guards)
	•	Shelves: POST /me/shelves/:type/items must 409 if book already on that shelf (idempotent OK).
	•	Meetings: startsAt < endsAt; virtual requires videoLink; in-person requires location.
	•	ReadingPlans: meetings must belong to same club; startMeeting <= endMeeting; forbid overlapping plans for same meetings; adjust currentBookId transactionally.
	•	Polls: no options after closing; cannot create poll for a meeting covered by an active ReadingPlan (unless admin override flag).
	•	Votes: one approval per (voter, option); for RCV, ranks must be contiguous starting at 1.

⸻

17) Rate Limits (suggested)
	•	Auth endpoints: 5/min/ip
	•	Mutations (POST/PATCH/DELETE): 60/min/user
	•	Search: 120/min/user
	•	Results: return Retry-After on 429

⸻

18) Security Notes
	•	Enforce ownership/role checks on:
	•	PATCH/DELETE /clubs/:id
	•	PATCH /clubs/:id/memberships/:userId
	•	POST/PATCH /meetings/*, reading-plans/*, polls/*
	•	Respect shelf visibility on all /users/:id/shelves* routes.
	•	Always scope queries by userId/clubId to avoid overfetch.

⸻

19) OpenAPI Next Steps (generation plan)

We’ll codify the above as OpenAPI 3.1 in packages/openapi/spec.yaml, then generate:
	•	Types: openapi-typescript → @bookclub/openapi/generated/types
	•	Clients: orval → @bookclub/openapi/generated/client (fetchers/hooks for web/mobile)
	•	Contract tests: small harness that loads spec.yaml and asserts every controller exposes the route & shape.

⸻

20) Scaffolding To-Do (API controllers & routes)
	•	AuthController → /auth/*
	•	UsersController → /me, /users/:id, shelves read
	•	ShelvesController → /me/shelves/:type/items, /me/shelf-items/:id
	•	BooksController → /books*, /books/import
	•	ClubsController → /clubs*
	•	MembershipsController → /clubs/:id/members*
	•	MeetingsController → /clubs/:id/meetings*, /meetings/:id*, RSVPs
	•	PollsController → /clubs/:id/polls*, /polls/:id*, options, votes, results
	•	ReadingPlansController → /clubs/:id/reading-plans*
	•	NotificationsController → /me/notifications*
	•	RealtimeController → /realtime/token
	•	UploadsController → /uploads/presign
	•	HealthController → /health, /version

⸻

If this catalog looks right, I’ll spin up the OpenAPI skeleton with all paths + component schemas, along with NestJS controller stubs and DTO validators that match these shapes. We’ll then wire Prisma models and a seed script so the first end-to-end (create club → meeting → poll → vote → reading plan) works out of the box.
