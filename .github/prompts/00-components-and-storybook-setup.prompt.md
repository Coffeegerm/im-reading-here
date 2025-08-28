# Storybook & shadcn/ui Component Library Setup

## Objective
Set up Storybook for the web application and create a foundational component library using shadcn/ui that aligns with our book club application needs and design system.

## Prerequisites
- Next.js 14.1.0 web application at `apps/web/`
- Tailwind CSS already configured with design tokens
- Monorepo structure with Turborepo

## Phase 1: Storybook Installation & Configuration

### 1.1 Install Storybook
```bash
# Navigate to web app directory
cd apps/web

# Initialize Storybook
npx storybook@latest init

# Install additional Storybook addons for our needs
pnpm add -D @storybook/addon-essentials @storybook/addon-a11y @storybook/addon-interactions @storybook/addon-docs @storybook/addon-viewport @storybook/addon-backgrounds
```

### 1.2 Configure Storybook
Update `.storybook/main.ts`:
```typescript
import type { StorybookConfig } from '@storybook/nextjs'
import path from 'path'

const config: StorybookConfig = {
  stories: [
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../src/**/*.story.@(js|jsx|mjs|ts|tsx)'
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-interactions',
    '@storybook/addon-docs',
    '@storybook/addon-viewport',
    '@storybook/addon-backgrounds'
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  webpackFinal: async (config) => {
    // Resolve aliases for monorepo
    config.resolve!.alias = {
      ...config.resolve!.alias,
      '@': path.resolve(__dirname, '../src'),
      '@im-reading-here/shared': path.resolve(__dirname, '../../packages/shared/src'),
    }
    return config
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  }
}

export default config
```

Update `.storybook/preview.ts`:
```typescript
import type { Preview } from '@storybook/react'
import '../src/app/globals.css'

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: 'hsl(0 0% 100%)',
        },
        {
          name: 'dark',
          value: 'hsl(222.2 84% 4.9%)',
        },
      ],
    },
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: { width: '375px', height: '667px' },
        },
        tablet: {
          name: 'Tablet',
          styles: { width: '768px', height: '1024px' },
        },
        desktop: {
          name: 'Desktop',
          styles: { width: '1280px', height: '800px' },
        },
      },
    },
  },
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: ['light', 'dark'],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme
      return (
        <div className={theme === 'dark' ? 'dark' : ''}>
          <div className="bg-background text-foreground min-h-screen p-4">
            <Story />
          </div>
        </div>
      )
    },
  ],
}

export default preview
```

### 1.3 Add Storybook Scripts
Update `apps/web/package.json` scripts section:
```json
{
  "scripts": {
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  }
}
```

## Phase 2: shadcn/ui Setup

### 2.1 Initialize shadcn/ui
```bash
# In apps/web directory
npx shadcn-ui@latest init

# When prompted, use these settings:
# - TypeScript: Yes
# - Style: Default
# - Base color: Slate
# - CSS file: src/app/globals.css
# - CSS variables: Yes
# - Tailwind config: tailwind.config.js
# - Components: src/components
# - Utils: src/lib/utils
# - React Server Components: Yes
```

### 2.2 Create Utils Library
Create `src/lib/utils.ts`:
```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Book club specific utilities
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  }).format(date)
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
```

## Phase 3: Core Component Installation & Creation

### 3.1 Install Essential shadcn/ui Components
```bash
# Core UI components for book club app
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add select
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add skeleton
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add form
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add calendar
npx shadcn-ui@latest add popover
npx shadcn-ui@latest add command
npx shadcn-ui@latest add alert
npx shadcn-ui@latest add progress
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add radio-group
```

### 3.2 Create Book Club Specific Components

#### 3.2.1 BookCard Component
Create `src/components/book-card.tsx`:
```typescript
import * as React from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface BookCardProps {
  title: string
  authors: string[]
  coverUrl?: string
  rating?: number
  publishedYear?: number
  className?: string
  onAddToShelf?: () => void
  onViewDetails?: () => void
  shelf?: 'TBR' | 'READ' | 'DNF'
  isInClub?: boolean
}

const BookCard = React.forwardRef<HTMLDivElement, BookCardProps>(
  ({
    title,
    authors,
    coverUrl,
    rating,
    publishedYear,
    className,
    onAddToShelf,
    onViewDetails,
    shelf,
    isInClub,
    ...props
  }, ref) => {
    const formatAuthors = (authors: string[]) => {
      if (authors.length === 1) return authors[0]
      if (authors.length === 2) return `${authors[0]} & ${authors[1]}`
      return `${authors[0]} et al.`
    }

    return (
      <Card ref={ref} className={cn("w-full max-w-sm group hover:shadow-md transition-shadow", className)} {...props}>
        <CardHeader className="pb-3">
          <div className="flex gap-3">
            <div className="relative w-16 h-24 flex-shrink-0 bg-muted rounded-md overflow-hidden">
              {coverUrl ? (
                <Image
                  src={coverUrl}
                  alt={`Cover of ${title}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                  No Cover
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-sm leading-tight line-clamp-2">{title}</CardTitle>
              <CardDescription className="text-xs mt-1">
                {formatAuthors(authors)}
                {publishedYear && <span className="ml-2">({publishedYear})</span>}
              </CardDescription>
              <div className="flex items-center gap-2 mt-2">
                {shelf && (
                  <Badge variant={shelf === 'READ' ? 'default' : shelf === 'DNF' ? 'destructive' : 'secondary'} className="text-xs">
                    {shelf}
                  </Badge>
                )}
                {isInClub && <Badge variant="outline" className="text-xs">Club</Badge>}
                {rating && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    ⭐ {rating}/5
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex gap-2">
            {onAddToShelf && (
              <Button size="sm" variant="outline" onClick={onAddToShelf} className="flex-1">
                Add to Shelf
              </Button>
            )}
            {onViewDetails && (
              <Button size="sm" onClick={onViewDetails} className="flex-1">
                Details
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }
)

BookCard.displayName = "BookCard"

export { BookCard }
```

#### 3.2.2 ClubCard Component
Create `src/components/club-card.tsx`:
```typescript
import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn, getInitials } from "@/lib/utils"

interface ClubMember {
  id: string
  name: string
  avatarUrl?: string
}

interface ClubCardProps {
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
    mode: 'IN_PERSON' | 'VIRTUAL'
  }
  members?: ClubMember[]
  userRole?: 'OWNER' | 'ADMIN' | 'MEMBER'
  className?: string
  onJoin?: () => void
  onView?: () => void
}

const ClubCard = React.forwardRef<HTMLDivElement, ClubCardProps>(
  ({
    name,
    description,
    memberCount,
    isPublic,
    currentBook,
    nextMeeting,
    members = [],
    userRole,
    className,
    onJoin,
    onView,
    ...props
  }, ref) => {
    const canJoin = !userRole && onJoin

    return (
      <Card ref={ref} className={cn("w-full group hover:shadow-md transition-shadow", className)} {...props}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle className="line-clamp-1">{name}</CardTitle>
              <CardDescription className="line-clamp-2 mt-1">
                {description || "No description available"}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 ml-3">
              {userRole && (
                <Badge variant={userRole === 'OWNER' ? 'default' : 'secondary'} className="text-xs">
                  {userRole}
                </Badge>
              )}
              <Badge variant={isPublic ? 'outline' : 'secondary'} className="text-xs">
                {isPublic ? 'Public' : 'Private'}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {memberCount} {memberCount === 1 ? 'member' : 'members'}
            </span>
            {members.length > 0 && (
              <div className="flex -space-x-2">
                {members.slice(0, 3).map((member) => (
                  <Avatar key={member.id} className="w-6 h-6 border-2 border-background">
                    <AvatarImage src={member.avatarUrl} alt={member.name} />
                    <AvatarFallback className="text-xs">
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {members.length > 3 && (
                  <div className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs text-muted-foreground">
                    +{members.length - 3}
                  </div>
                )}
              </div>
            )}
          </div>

          {currentBook && (
            <div className="p-3 bg-muted/50 rounded-md">
              <p className="text-xs text-muted-foreground mb-1">Currently reading</p>
              <p className="text-sm font-medium line-clamp-1">{currentBook.title}</p>
            </div>
          )}

          {nextMeeting && (
            <div className="text-xs text-muted-foreground">
              Next meeting: {nextMeeting.date.toLocaleDateString()} • {nextMeeting.mode === 'VIRTUAL' ? 'Virtual' : 'In-person'}
            </div>
          )}

          <div className="flex gap-2 pt-2">
            {canJoin && (
              <Button size="sm" onClick={onJoin} className="flex-1">
                Join Club
              </Button>
            )}
            {onView && (
              <Button size="sm" variant={canJoin ? "outline" : "default"} onClick={onView} className={canJoin ? "" : "flex-1"}>
                View Details
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }
)

ClubCard.displayName = "ClubCard"

export { ClubCard }
```

#### 3.2.3 MeetingCard Component
Create `src/components/meeting-card.tsx`:
```typescript
import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn, formatDateTime } from "@/lib/utils"
import { CalendarIcon, MapPinIcon, VideoIcon, ClockIcon } from "lucide-react"

interface MeetingCardProps {
  title?: string
  startsAt: Date
  endsAt?: Date
  mode: 'IN_PERSON' | 'VIRTUAL'
  location?: string
  videoLink?: string
  agenda?: string
  currentBook?: {
    title: string
    coverUrl?: string
  }
  rsvpStatus?: 'GOING' | 'MAYBE' | 'NO'
  rsvpCount?: number
  className?: string
  onRSVP?: (status: 'GOING' | 'MAYBE' | 'NO') => void
  onViewDetails?: () => void
}

const MeetingCard = React.forwardRef<HTMLDivElement, MeetingCardProps>(
  ({
    title,
    startsAt,
    endsAt,
    mode,
    location,
    videoLink,
    agenda,
    currentBook,
    rsvpStatus,
    rsvpCount,
    className,
    onRSVP,
    onViewDetails,
    ...props
  }, ref) => {
    const isUpcoming = startsAt > new Date()
    const isPast = startsAt < new Date()

    return (
      <Card ref={ref} className={cn("w-full group hover:shadow-md transition-shadow", className)} {...props}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg">
                {title || `${mode === 'VIRTUAL' ? 'Virtual' : 'In-Person'} Meeting`}
              </CardTitle>
              <CardDescription className="mt-1">
                <div className="flex items-center gap-1 text-sm">
                  <CalendarIcon className="w-4 h-4" />
                  {formatDateTime(startsAt)}
                </div>
                {endsAt && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <ClockIcon className="w-3 h-3" />
                    Duration: {Math.round((endsAt.getTime() - startsAt.getTime()) / (1000 * 60))} min
                  </div>
                )}
              </CardDescription>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge variant={mode === 'VIRTUAL' ? 'default' : 'secondary'} className="text-xs">
                {mode === 'VIRTUAL' ? (
                  <><VideoIcon className="w-3 h-3 mr-1" />Virtual</>
                ) : (
                  <><MapPinIcon className="w-3 h-3 mr-1" />In-Person</>
                )}
              </Badge>
              {isPast && <Badge variant="outline" className="text-xs">Past</Badge>}
              {rsvpStatus && (
                <Badge
                  variant={rsvpStatus === 'GOING' ? 'default' : rsvpStatus === 'MAYBE' ? 'secondary' : 'destructive'}
                  className="text-xs"
                >
                  {rsvpStatus}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {(location || videoLink) && (
            <div className="text-sm">
              {mode === 'IN_PERSON' && location && (
                <div className="flex items-start gap-2">
                  <MapPinIcon className="w-4 h-4 mt-0.5 text-muted-foreground" />
                  <span>{location}</span>
                </div>
              )}
              {mode === 'VIRTUAL' && videoLink && (
                <div className="flex items-center gap-2">
                  <VideoIcon className="w-4 h-4 text-muted-foreground" />
                  <a href={videoLink} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                    Join Virtual Meeting
                  </a>
                </div>
              )}
            </div>
          )}

          {currentBook && (
            <div className="p-3 bg-muted/50 rounded-md">
              <p className="text-xs text-muted-foreground mb-1">Discussion topic</p>
              <p className="text-sm font-medium">{currentBook.title}</p>
            </div>
          )}

          {agenda && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Agenda</p>
              <p className="text-sm line-clamp-3">{agenda}</p>
            </div>
          )}

          {rsvpCount !== undefined && (
            <div className="text-xs text-muted-foreground">
              {rsvpCount} {rsvpCount === 1 ? 'person has' : 'people have'} RSVP'd
            </div>
          )}

          <div className="flex gap-2 pt-2">
            {onRSVP && isUpcoming && (
              <>
                <Button
                  size="sm"
                  variant={rsvpStatus === 'GOING' ? 'default' : 'outline'}
                  onClick={() => onRSVP('GOING')}
                  className="flex-1"
                >
                  Going
                </Button>
                <Button
                  size="sm"
                  variant={rsvpStatus === 'MAYBE' ? 'default' : 'outline'}
                  onClick={() => onRSVP('MAYBE')}
                  className="flex-1"
                >
                  Maybe
                </Button>
                <Button
                  size="sm"
                  variant={rsvpStatus === 'NO' ? 'destructive' : 'outline'}
                  onClick={() => onRSVP('NO')}
                  className="flex-1"
                >
                  Can't Go
                </Button>
              </>
            )}
            {onViewDetails && (
              <Button size="sm" variant="outline" onClick={onViewDetails}>
                Details
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }
)

MeetingCard.displayName = "MeetingCard"

export { MeetingCard }
```

## Phase 4: Storybook Stories

### 4.1 Create Stories for Core Components

#### BookCard Stories
Create `src/components/book-card.stories.tsx`:
```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { BookCard } from './book-card'

const meta: Meta<typeof BookCard> = {
  title: 'Components/BookCard',
  component: BookCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    shelf: {
      control: 'select',
      options: ['TBR', 'READ', 'DNF'],
    },
    rating: {
      control: { type: 'range', min: 1, max: 5 },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Dune',
    authors: ['Frank Herbert'],
    publishedYear: 1965,
    coverUrl: 'https://covers.openlibrary.org/b/id/8552218-M.jpg',
  },
}

export const WithRating: Story = {
  args: {
    title: 'The Hobbit',
    authors: ['J.R.R. Tolkien'],
    publishedYear: 1937,
    rating: 5,
    shelf: 'READ',
    coverUrl: 'https://covers.openlibrary.org/b/id/8091016-M.jpg',
  },
}

export const MultipleAuthors: Story = {
  args: {
    title: 'Good Omens',
    authors: ['Terry Pratchett', 'Neil Gaiman'],
    publishedYear: 1990,
    shelf: 'TBR',
    isInClub: true,
  },
}

export const NoCover: Story = {
  args: {
    title: 'Some Obscure Book Title That Is Really Long',
    authors: ['Unknown Author', 'Another Author', 'Third Author'],
    publishedYear: 2023,
    shelf: 'DNF',
    rating: 2,
  },
}

export const WithActions: Story = {
  args: {
    title: 'Project Hail Mary',
    authors: ['Andy Weir'],
    publishedYear: 2021,
    onAddToShelf: () => alert('Added to shelf!'),
    onViewDetails: () => alert('Viewing details!'),
  },
}
```

#### ClubCard Stories
Create `src/components/club-card.stories.tsx`:
```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { ClubCard } from './club-card'

const meta: Meta<typeof ClubCard> = {
  title: 'Components/ClubCard',
  component: ClubCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    userRole: {
      control: 'select',
      options: ['OWNER', 'ADMIN', 'MEMBER'],
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

const mockMembers = [
  { id: '1', name: 'Alice Johnson', avatarUrl: 'https://i.pravatar.cc/150?u=alice' },
  { id: '2', name: 'Bob Smith', avatarUrl: 'https://i.pravatar.cc/150?u=bob' },
  { id: '3', name: 'Charlie Davis' },
  { id: '4', name: 'Diana Wilson' },
  { id: '5', name: 'Eva Brown' },
]

export const Default: Story = {
  args: {
    name: 'Sci-Fi Enthusiasts',
    description: 'A club for lovers of science fiction literature',
    memberCount: 12,
    isPublic: true,
    members: mockMembers.slice(0, 3),
  },
}

export const OwnerView: Story = {
  args: {
    name: 'Book Club Supreme',
    description: 'The ultimate reading experience with monthly meetings and thoughtful discussions',
    memberCount: 24,
    isPublic: false,
    userRole: 'OWNER',
    members: mockMembers,
    currentBook: {
      title: 'Klara and the Sun',
      coverUrl: 'https://covers.openlibrary.org/b/id/10909258-M.jpg',
    },
    nextMeeting: {
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      mode: 'VIRTUAL',
    },
  },
}

export const PublicClub: Story = {
  args: {
    name: 'Mystery Monday',
    description: 'Dive into the world of mystery and thriller novels every Monday evening',
    memberCount: 8,
    isPublic: true,
    onJoin: () => alert('Joining club!'),
    onView: () => alert('Viewing club details!'),
    nextMeeting: {
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      mode: 'IN_PERSON',
    },
  },
}

export const LargeClub: Story = {
  args: {
    name: 'Global Readers United',
    memberCount: 156,
    isPublic: true,
    userRole: 'MEMBER',
    members: mockMembers,
    currentBook: {
      title: 'The Seven Husbands of Evelyn Hugo',
    },
  },
}
```

#### MeetingCard Stories
Create `src/components/meeting-card.stories.tsx`:
```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { MeetingCard } from './meeting-card'

const meta: Meta<typeof MeetingCard> = {
  title: 'Components/MeetingCard',
  component: MeetingCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: 'select',
      options: ['IN_PERSON', 'VIRTUAL'],
    },
    rsvpStatus: {
      control: 'select',
      options: ['GOING', 'MAYBE', 'NO'],
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
const pastDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago

export const UpcomingVirtual: Story = {
  args: {
    title: 'Monthly Book Discussion',
    startsAt: futureDate,
    endsAt: new Date(futureDate.getTime() + 2 * 60 * 60 * 1000), // 2 hours later
    mode: 'VIRTUAL',
    videoLink: 'https://meet.google.com/abc-defg-hij',
    agenda: 'Discussion of chapters 1-5 of "Dune" by Frank Herbert. We will cover the world-building, character development, and themes introduced in the opening section.',
    currentBook: {
      title: 'Dune',
      coverUrl: 'https://covers.openlibrary.org/b/id/8552218-M.jpg',
    },
    rsvpCount: 8,
    onRSVP: (status) => alert(`RSVP'd: ${status}`),
    onViewDetails: () => alert('Viewing meeting details!'),
  },
}

export const InPersonWithRSVP: Story = {
  args: {
    startsAt: futureDate,
    mode: 'IN_PERSON',
    location: 'Central Library, Conference Room B',
    rsvpStatus: 'GOING',
    rsvpCount: 5,
    currentBook: {
      title: 'The Midnight Library',
    },
    onRSVP: (status) => alert(`Changed RSVP to: ${status}`),
  },
}

export const PastMeeting: Story = {
  args: {
    title: 'January Book Club Meeting',
    startsAt: pastDate,
    endsAt: new Date(pastDate.getTime() + 90 * 60 * 1000), // 90 minutes
    mode: 'VIRTUAL',
    agenda: 'Discussed "Project Hail Mary" - great turnout and engaging discussion about science fiction themes.',
    currentBook: {
      title: 'Project Hail Mary',
    },
    rsvpStatus: 'GOING',
    rsvpCount: 12,
  },
}

export const Minimal: Story = {
  args: {
    startsAt: futureDate,
    mode: 'IN_PERSON',
    location: 'Coffee Shop Downtown',
    onViewDetails: () => alert('View details'),
  },
}
```

## Phase 5: Component Index & Shared Package Integration

### 5.1 Create Component Index
Create `src/components/index.ts`:
```typescript
// UI Components (shadcn/ui)
export * from './ui/button'
export * from './ui/card'
export * from './ui/input'
export * from './ui/label'
export * from './ui/textarea'
export * from './ui/select'
export * from './ui/dialog'
export * from './ui/dropdown-menu'
export * from './ui/avatar'
export * from './ui/badge'
export * from './ui/separator'
export * from './ui/skeleton'
export * from './ui/toast'
export * from './ui/form'
export * from './ui/tabs'
export * from './ui/calendar'
export * from './ui/popover'
export * from './ui/command'
export * from './ui/alert'
export * from './ui/progress'
export * from './ui/checkbox'
export * from './ui/radio-group'

// Custom Components
export { BookCard } from './book-card'
export { ClubCard } from './club-card'
export { MeetingCard } from './meeting-card'

// Utilities
export { cn, formatDate, formatDateTime, getInitials } from '@/lib/utils'
```

### 5.2 Update Shared Package Types
Update `packages/shared/src/types.ts` to include UI-related types:
```typescript
// Add to existing types...

export interface Book {
  id: string
  isbn10?: string
  isbn13?: string
  openlibraryId?: string
  title: string
  authors: string[]
  coverUrl?: string
  publishedYear?: number
  subjects?: string[]
}

export interface Club {
  id: string
  ownerId: string
  name: string
  description?: string
  isPublic: boolean
  memberCount: number
  currentBook?: Book
}

export interface Meeting {
  id: string
  clubId: string
  startsAt: Date
  endsAt?: Date
  mode: 'IN_PERSON' | 'VIRTUAL'
  location?: string
  videoLink?: string
  agenda?: string
  currentBookId?: string
}

export type ShelfType = 'TBR' | 'READ' | 'DNF'
export type MemberRole = 'OWNER' | 'ADMIN' | 'MEMBER'
export type RSVPStatus = 'GOING' | 'MAYBE' | 'NO'
```

## Phase 6: Testing & Documentation

### 6.1 Add Component Tests
Create `src/components/__tests__/book-card.test.tsx`:
```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { BookCard } from '../book-card'

describe('BookCard', () => {
  const defaultProps = {
    title: 'Test Book',
    authors: ['Test Author'],
  }

  it('renders book title and authors', () => {
    render(<BookCard {...defaultProps} />)
    expect(screen.getByText('Test Book')).toBeInTheDocument()
    expect(screen.getByText('Test Author')).toBeInTheDocument()
  })

  it('displays rating when provided', () => {
    render(<BookCard {...defaultProps} rating={4} />)
    expect(screen.getByText('⭐ 4/5')).toBeInTheDocument()
  })

  it('calls onAddToShelf when button is clicked', () => {
    const mockAddToShelf = jest.fn()
    render(<BookCard {...defaultProps} onAddToShelf={mockAddToShelf} />)

    fireEvent.click(screen.getByText('Add to Shelf'))
    expect(mockAddToShelf).toHaveBeenCalledTimes(1)
  })

  it('shows shelf badge when shelf is provided', () => {
    render(<BookCard {...defaultProps} shelf="READ" />)
    expect(screen.getByText('READ')).toBeInTheDocument()
  })
})
```

### 6.2 Add Storybook Scripts to Root
Update root `package.json`:
```json
{
  "scripts": {
    "storybook": "cd apps/web && pnpm storybook",
    "build-storybook": "cd apps/web && pnpm build-storybook"
  }
}
```

## Success Criteria

✅ Storybook running on `http://localhost:6006`
✅ All shadcn/ui components installed and configured
✅ BookCard, ClubCard, and MeetingCard components created
✅ Comprehensive Storybook stories for all custom components
✅ Dark/light theme support in Storybook
✅ Accessibility addon configured
✅ Components follow design system tokens from design-basis.md
✅ Type-safe props with TypeScript
✅ Responsive design considerations
✅ Component tests in place

## Next Steps

1. Run Storybook: `pnpm storybook`
2. Create additional components as needed (PollCard, UserProfile, etc.)
3. Add interaction tests using Storybook's play functions
4. Set up visual regression testing with Chromatic (optional)
5. Document component usage patterns in Storybook docs
