export * from './Common';
export * from './OpenLibrary';
export * from './Books';

// Common types based on Prisma schema

export type ShelfType = 'TBR' | 'READ' | 'DNF'
export type MemberRole = 'OWNER' | 'ADMIN' | 'MEMBER'
export type MemberStatus = 'ACTIVE' | 'PENDING' | 'BANNED'
export type MeetingMode = 'IN_PERSON' | 'VIRTUAL'
export type PollStatus = 'OPEN' | 'CLOSED'
export type PollMethod = 'APPROVAL' | 'RCV'
export type RsvpStatus = 'GOING' | 'MAYBE' | 'NO'

export interface User {
  id: string
  email: string
  name: string
  avatarUrl?: string
  shelvesVisibleTo: 'public' | 'club' | 'private'
  createdAt: Date
  updatedAt: Date
}

export interface Book {
  id: string
  isbn10?: string
  isbn13?: string
  openlibraryId?: string
  title: string
  authors: string[]
  coverUrl?: string
  publishedYear?: number
  subjects: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Club {
  id: string
  ownerId: string
  name: string
  description?: string
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Membership {
  id: string
  clubId: string
  userId: string
  role: MemberRole
  status: MemberStatus
  joinedAt: Date
}

export interface Meeting {
  id: string
  clubId: string
  startsAt: Date
  endsAt?: Date
  mode: MeetingMode
  location?: string
  videoLink?: string
  agenda?: string
  currentBookId?: string
  createdAt: Date
  updatedAt: Date
}

export interface Poll {
  id: string
  clubId: string
  meetingId?: string
  createdBy: string
  status: PollStatus
  method: PollMethod
  createdAt: Date
  updatedAt: Date
}

// API Response types
export interface ApiResponse<T> {
  data: T
  meta: {
    requestId: string
    nextCursor?: string
  }
}

export interface ApiError {
  error: {
    code: string
    message: string
    details?: Array<{
      path: string
      reason: string
    }>
  }
  meta: {
    requestId: string
  }
}

// UI Component types
export interface ClubMember {
  id: string
  name: string
  avatarUrl?: string
}

export interface BookDisplayInfo {
  id: string
  title: string
  authors: string[]
  coverUrl?: string
  publishedYear?: number
  rating?: number
  shelf?: ShelfType
  isInClub?: boolean
}

export interface ClubDisplayInfo {
  id: string
  name: string
  description?: string
  memberCount: number
  isPublic: boolean
  currentBook?: {
    title: string
    coverUrl?: string
  }
  nextMeeting?: {
    date: Date
    mode: MeetingMode
  }
  members?: ClubMember[]
  userRole?: MemberRole
}

export interface MeetingDisplayInfo {
  id: string
  title?: string
  startsAt: Date
  endsAt?: Date
  mode: MeetingMode
  location?: string
  videoLink?: string
  agenda?: string
  currentBook?: {
    title: string
    coverUrl?: string
  }
  rsvpStatus?: RsvpStatus
  rsvpCount?: number
}
