/**
 * Shared seed data for local development
 * Contains realistic test data for the book club application
 */

export interface SeedUser {
  email: string;
  name: string;
  avatarUrl?: string;
  plan: 'FREE' | 'PREMIUM';
  shelvesVisibleTo: 'public' | 'club' | 'private';
}

export interface SeedBook {
  isbn10?: string;
  isbn13?: string;
  openlibraryId?: string;
  title: string;
  authors: string[];
  coverUrl?: string;
  publishedYear?: number;
  subjects: string[];
}

export interface SeedClub {
  name: string;
  description?: string;
  isPublic: boolean;
  ownerEmail: string;
}

// Sample users for development
export const seedUsers: SeedUser[] = [
  {
    email: 'alice@example.com',
    name: 'Alice Johnson',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    plan: 'PREMIUM',
    shelvesVisibleTo: 'public',
  },
  {
    email: 'bob@example.com',
    name: 'Bob Smith',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    plan: 'FREE',
    shelvesVisibleTo: 'club',
  },
  {
    email: 'carol@example.com',
    name: 'Carol Williams',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    plan: 'FREE',
    shelvesVisibleTo: 'private',
  },
  {
    email: 'david@example.com',
    name: 'David Brown',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    plan: 'PREMIUM',
    shelvesVisibleTo: 'club',
  },
  {
    email: 'eve@example.com',
    name: 'Eve Davis',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    plan: 'FREE',
    shelvesVisibleTo: 'public',
  },
  {
    email: 'frank@example.com',
    name: 'Frank Miller',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    plan: 'PREMIUM',
    shelvesVisibleTo: 'club',
  },
];

// Popular books for development
export const seedBooks: SeedBook[] = [
  {
    isbn13: '9780142437179',
    isbn10: '0142437174',
    openlibraryId: 'OL7353617M',
    title: 'The Handmaid\'s Tale',
    authors: ['Margaret Atwood'],
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780142437179-M.jpg',
    publishedYear: 1985,
    subjects: ['Fiction', 'Dystopian', 'Feminism', 'Science Fiction'],
  },
  {
    isbn13: '9780525478812',
    title: 'The Seven Husbands of Evelyn Hugo',
    authors: ['Taylor Jenkins Reid'],
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780525478812-M.jpg',
    publishedYear: 2017,
    subjects: ['Fiction', 'Romance', 'Historical Fiction', 'LGBTQ+'],
  },
  {
    isbn13: '9780316769488',
    isbn10: '0316769487',
    title: 'The Catcher in the Rye',
    authors: ['J.D. Salinger'],
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780316769488-M.jpg',
    publishedYear: 1951,
    subjects: ['Fiction', 'Coming of Age', 'Classic Literature'],
  },
  {
    isbn13: '9780062315007',
    title: 'The Alchemist',
    authors: ['Paulo Coelho'],
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780062315007-M.jpg',
    publishedYear: 1988,
    subjects: ['Fiction', 'Philosophy', 'Adventure', 'Spiritual'],
  },
  {
    isbn13: '9780544003415',
    title: 'The Lord of the Rings',
    authors: ['J.R.R. Tolkien'],
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780544003415-M.jpg',
    publishedYear: 1954,
    subjects: ['Fantasy', 'Adventure', 'Classic Literature', 'Epic'],
  },
  {
    isbn13: '9780385504201',
    title: 'The Fault in Our Stars',
    authors: ['John Green'],
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780385504201-M.jpg',
    publishedYear: 2012,
    subjects: ['Young Adult', 'Romance', 'Drama', 'Cancer'],
  },
  {
    isbn13: '9780385737951',
    title: 'Becoming',
    authors: ['Michelle Obama'],
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780385537951-M.jpg',
    publishedYear: 2018,
    subjects: ['Biography', 'Memoir', 'Politics', 'Inspiration'],
  },
  {
    isbn13: '9780062073556',
    title: 'Educated',
    authors: ['Tara Westover'],
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780399590504-M.jpg',
    publishedYear: 2018,
    subjects: ['Memoir', 'Education', 'Family', 'Self-Discovery'],
  },
  {
    isbn13: '9780553380163',
    title: 'A Brief History of Time',
    authors: ['Stephen Hawking'],
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780553380163-M.jpg',
    publishedYear: 1988,
    subjects: ['Science', 'Physics', 'Cosmology', 'Popular Science'],
  },
  {
    isbn13: '9780374533557',
    title: 'Klara and the Sun',
    authors: ['Kazuo Ishiguro'],
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780374279657-M.jpg',
    publishedYear: 2021,
    subjects: ['Science Fiction', 'Literary Fiction', 'AI', 'Philosophy'],
  },
  {
    isbn13: '9780143034902',
    title: 'The Kite Runner',
    authors: ['Khaled Hosseini'],
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780143034902-M.jpg',
    publishedYear: 2003,
    subjects: ['Fiction', 'Historical Fiction', 'Afghanistan', 'Friendship'],
  },
  {
    isbn13: '9780525559474',
    title: 'Where the Crawdads Sing',
    authors: ['Delia Owens'],
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780735219090-M.jpg',
    publishedYear: 2018,
    subjects: ['Fiction', 'Mystery', 'Nature', 'Coming of Age'],
  },
];

// Sample book clubs
export const seedClubs: SeedClub[] = [
  {
    name: 'Literary Explorers',
    description: 'A club dedicated to exploring classic and contemporary literature from around the world.',
    isPublic: true,
    ownerEmail: 'alice@example.com',
  },
  {
    name: 'Sci-Fi & Fantasy Fans',
    description: 'Dive into other worlds with us as we read the best science fiction and fantasy novels.',
    isPublic: true,
    ownerEmail: 'david@example.com',
  },
  {
    name: 'Non-Fiction Nerds',
    description: 'Learn something new every month with biographies, self-help, and educational reads.',
    isPublic: false,
    ownerEmail: 'eve@example.com',
  },
  {
    name: 'Local Library Book Club',
    description: 'A cozy community book club that meets monthly at the local library.',
    isPublic: true,
    ownerEmail: 'bob@example.com',
  },
  {
    name: 'Young Adult Enthusiasts',
    description: 'Rediscover the magic of YA literature with fellow enthusiasts.',
    isPublic: false,
    ownerEmail: 'carol@example.com',
  },
];

// Custom shelf ideas for seeding
export const customShelfNames = [
  'Favorites',
  'Beach Reads',
  'Book Club Picks',
  'Classics to Read',
  'Recommended by Friends',
  'Award Winners',
  'Quick Reads',
  'Series to Binge',
  'Educational',
  'Mood Boosters',
];

// Meeting agendas for variety
export const meetingAgendas = [
  'Welcome new members and discuss our current book selection',
  'Chapter 1-5 discussion and character analysis',
  'Mid-book check-in: themes and predictions',
  'Final discussion and book rating',
  'Vote on next month\'s book selection',
  'Author deep-dive and related book recommendations',
  'Book-to-movie adaptation comparison',
  'Genre exploration: what makes a good mystery?',
];

/**
 * Helper functions for generating realistic data
 */
export const helpers = {
  randomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  },

  randomElements<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, array.length));
  },

  randomDate(start: Date, end: Date): Date {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  },

  futureDate(daysFromNow: number = 30): Date {
    return new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000);
  },

  pastDate(daysAgo: number = 30): Date {
    return new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
  },

  randomRating(): number {
    return Math.floor(Math.random() * 5) + 1;
  },

  generateReview(bookTitle: string, rating: number): string {
    const positiveReviews = [
      `Absolutely loved "${bookTitle}"! The storytelling was captivating from start to finish.`,
      `"${bookTitle}" exceeded all my expectations. Couldn't put it down!`,
      `What a fantastic read! "${bookTitle}" had me thinking long after I finished it.`,
      `"${bookTitle}" is now one of my all-time favorites. Highly recommend!`,
      `Beautiful writing in "${bookTitle}". The characters felt so real and relatable.`,
    ];

    const neutralReviews = [
      `"${bookTitle}" was decent. Had some good moments but didn't quite grab me.`,
      `Mixed feelings about "${bookTitle}". Some parts were great, others felt slow.`,
      `"${bookTitle}" was okay. Not bad, but not amazing either.`,
      `"${bookTitle}" had potential but didn't fully deliver for me.`,
    ];

    const negativeReviews = [
      `"${bookTitle}" wasn't for me. Found it hard to get into.`,
      `Struggled to finish "${bookTitle}". The pacing felt off.`,
      `"${bookTitle}" had promise but fell flat in execution.`,
      `Not my cup of tea. "${bookTitle}" just didn't resonate with me.`,
    ];

    if (rating >= 4) {
      return helpers.randomElement(positiveReviews);
    } else if (rating >= 3) {
      return helpers.randomElement(neutralReviews);
    } else {
      return helpers.randomElement(negativeReviews);
    }
  },
};
