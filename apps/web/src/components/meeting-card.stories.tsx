import type { Meta, StoryObj } from '@storybook/nextjs-vite'

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
