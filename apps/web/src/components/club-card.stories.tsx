import type { Meta, StoryObj } from '@storybook/nextjs-vite'
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
