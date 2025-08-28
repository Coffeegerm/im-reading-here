import type { Meta, StoryObj } from '@storybook/nextjs-vite'
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
