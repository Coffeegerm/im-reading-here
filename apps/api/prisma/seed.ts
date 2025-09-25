import { PrismaClient, ShelfType } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import {
  seedUsers,
  seedBooks,
  seedClubs,
  customShelfNames,
  meetingAgendas,
  helpers,
} from './seed-data';

const prisma = new PrismaClient();

// Supabase configuration for local development
const supabaseUrl = process.env.SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function createSupabaseUser(userData: typeof seedUsers[0], password: string = 'password123') {
  try {
    // Create user in Supabase Auth
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password,
      email_confirm: true, // Auto-confirm for local development
      user_metadata: {
        name: userData.name,
        avatar_url: userData.avatarUrl,
      },
    });

    if (authError) {
      console.error(`❌ Failed to create Supabase user ${userData.email}:`, authError.message);
      return null;
    }

    console.log(`  ✅ Created Supabase user: ${userData.name} (${userData.email})`);
    return authUser.user;
  } catch (error) {
    console.error(`❌ Error creating Supabase user ${userData.email}:`, error);
    return null;
  }
}

async function main() {
  console.log('🌱 Starting database seed with Supabase authentication...');

  // Clean existing data
  console.log('🧹 Cleaning existing data...');
  await prisma.vote.deleteMany({});
  await prisma.pollOption.deleteMany({});
  await prisma.poll.deleteMany({});
  await prisma.rsvp.deleteMany({});
  await prisma.readingPlan.deleteMany({});
  await prisma.meeting.deleteMany({});
  await prisma.membership.deleteMany({});
  await prisma.club.deleteMany({});
  await prisma.shelfItem.deleteMany({});
  await prisma.shelf.deleteMany({});
  await prisma.book.deleteMany({});
  await prisma.user.deleteMany({});

  // Clean Supabase users (optional - be careful in production)
  console.log('🧹 Cleaning Supabase auth users...');
  try {
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    if (existingUsers?.users) {
      for (const user of existingUsers.users) {
        await supabase.auth.admin.deleteUser(user.id);
      }
    }
  } catch (error) {
    console.log('⚠️ Note: Could not clean existing Supabase users (this is okay for first run)');
  }

  console.log('📚 Creating books...');
  const createdBooks = [];
  for (const bookData of seedBooks) {
    const book = await prisma.book.create({
      data: {
        isbn10: bookData.isbn10,
        isbn13: bookData.isbn13,
        openlibraryId: bookData.openlibraryId,
        title: bookData.title,
        authors: bookData.authors,
        coverUrl: bookData.coverUrl,
        publishedYear: bookData.publishedYear,
        subjects: bookData.subjects,
      },
    });
    createdBooks.push(book);
    console.log(`  ✅ Created book: ${book.title}`);
  }

  console.log('👥 Creating users with Supabase authentication...');
  const createdUsers = [];

  for (const userData of seedUsers) {
    // Create user in Supabase Auth first
    const supabaseUser = await createSupabaseUser(userData);

    if (!supabaseUser) {
      console.log(`  ⚠️ Skipping Prisma user creation for ${userData.email} due to Supabase error`);
      continue;
    }

    // Create user in Prisma with Supabase UUID
    const user = await prisma.user.create({
      data: {
        id: supabaseUser.id, // Use Supabase UUID
        email: userData.email,
        name: userData.name,
        avatarUrl: userData.avatarUrl,
        plan: userData.plan,
        shelvesVisibleTo: userData.shelvesVisibleTo,
      },
    });
    createdUsers.push(user);
    console.log(`  ✅ Created Prisma user: ${user.name} (${user.email})`);

    // Core shelves are automatically created by database trigger
    console.log(`    📂 Core shelves auto-created for ${user.name}`);

    // Create custom shelves (more for premium users)
    const numCustomShelves = userData.plan === 'PREMIUM' ?
      Math.floor(Math.random() * 4) + 2 : // 2-5 for premium
      Math.floor(Math.random() * 2) + 1;   // 1-2 for free

    const selectedShelfNames = helpers.randomElements(customShelfNames, numCustomShelves);
    for (const shelfName of selectedShelfNames) {
      await prisma.shelf.create({
        data: {
          userId: user.id,
          type: ShelfType.CUSTOM,
          name: shelfName,
        },
      });
    }
    console.log(`    📋 Created ${numCustomShelves} custom shelves for ${user.name}`);
  }

  if (createdUsers.length === 0) {
    console.error('❌ No users were created successfully. Cannot continue with seeding.');
    return;
  }

  console.log('📖 Adding books to user shelves...');
  for (const user of createdUsers) {
    const userShelves = await prisma.shelf.findMany({
      where: { userId: user.id },
    });

    // Add some books to each shelf (both predefined and custom)
    for (const shelf of userShelves) {
      // Skip adding books to some custom shelves randomly
      if (shelf.type === ShelfType.CUSTOM && Math.random() < 0.3) {
        continue; // 30% chance of custom shelf being empty
      }

      const numBooks = shelf.type === ShelfType.CUSTOM ?
        Math.floor(Math.random() * 3) + 1 : // 1-3 books for custom shelves
        Math.floor(Math.random() * 4) + 1;  // 1-4 books for predefined shelves

      const selectedBooks = helpers.randomElements(createdBooks, numBooks);

      for (const book of selectedBooks) {
        const rating = shelf.type === ShelfType.READ ? helpers.randomRating() : null;
        const review = shelf.type === ShelfType.READ && Math.random() > 0.5 ?
          helpers.generateReview(book.title, rating!) : null;
        const finishedAt = shelf.type === ShelfType.READ ? helpers.pastDate(Math.floor(Math.random() * 365)) : null;

        const addedAt = shelf.type === ShelfType.CUSTOM ?
          helpers.pastDate(Math.floor(Math.random() * 90)) :   // More recent for custom shelves
          helpers.pastDate(Math.floor(Math.random() * 180));   // Longer range for predefined

        await prisma.shelfItem.create({
          data: {
            shelfId: shelf.id,
            bookId: book.id,
            rating,
            review,
            finishedAt,
            addedAt,
          },
        });
      }
    }
  }

  console.log('🏛️ Creating book clubs...');
  const createdClubs = [];
  for (const clubData of seedClubs) {
    const owner = createdUsers.find(u => u.email === clubData.ownerEmail);
    if (!owner) {
      console.log(`  ⚠️ Skipping club ${clubData.name} - owner ${clubData.ownerEmail} not found`);
      continue;
    }

    const club = await prisma.club.create({
      data: {
        name: clubData.name,
        description: clubData.description,
        isPublic: clubData.isPublic,
        ownerId: owner.id,
      },
    });
    createdClubs.push(club);
    console.log(`  ✅ Created club: ${club.name}`);

    // Add owner as member
    await prisma.membership.create({
      data: {
        clubId: club.id,
        userId: owner.id,
        role: 'OWNER',
        status: 'ACTIVE',
      },
    });

    // Add other members
    const otherUsers = createdUsers.filter(u => u.id !== owner.id);
    const numMembers = Math.min(otherUsers.length, Math.floor(Math.random() * 4) + 2); // 2-5 additional members
    const members = helpers.randomElements(otherUsers, numMembers);

    for (const member of members) {
      const role = Math.random() > 0.8 ? 'ADMIN' : 'MEMBER';
      const status = Math.random() > 0.9 ? 'PENDING' : 'ACTIVE';

      await prisma.membership.create({
        data: {
          clubId: club.id,
          userId: member.id,
          role,
          status,
          joinedAt: helpers.pastDate(Math.floor(Math.random() * 90)),
        },
      });
    }
    console.log(`    👥 Added ${members.length + 1} members to ${club.name}`);
  }

  console.log('📅 Creating meetings...');
  for (const club of createdClubs) {
    const numMeetings = Math.floor(Math.random() * 3) + 2; // 2-4 meetings per club

    for (let i = 0; i < numMeetings; i++) {
      const isPast = i < numMeetings - 1; // Last meeting is in future
      const startsAt = isPast ?
        helpers.pastDate(Math.floor(Math.random() * 60) + (i * 30)) :
        helpers.futureDate(Math.floor(Math.random() * 30) + 7);

      const endsAt = new Date(startsAt.getTime() + 2 * 60 * 60 * 1000); // 2 hours later
      const mode = helpers.randomElement(['IN_PERSON', 'VIRTUAL'] as const);
      const currentBook = helpers.randomElement(createdBooks);

      const meeting = await prisma.meeting.create({
        data: {
          clubId: club.id,
          startsAt,
          endsAt,
          mode,
          location: mode === 'IN_PERSON' ? 'Local Library - Meeting Room A' : undefined,
          videoLink: mode === 'VIRTUAL' ? 'https://meet.google.com/abc-defg-hij' : undefined,
          agenda: helpers.randomElement(meetingAgendas),
          currentBookId: currentBook.id,
        },
      });

      console.log(`    📅 Created meeting for ${club.name} on ${startsAt.toDateString()}`);

      // Add RSVPs for existing meetings
      if (isPast || Math.random() > 0.3) { // Past meetings or 70% of future meetings have RSVPs
        const members = await prisma.membership.findMany({
          where: { clubId: club.id, status: 'ACTIVE' },
          include: { user: true },
        });

        for (const membership of members) {
          if (Math.random() > 0.2) { // 80% chance of RSVP
            const status = helpers.randomElement(['GOING', 'MAYBE', 'NO'] as const);
            await prisma.rsvp.create({
              data: {
                meetingId: meeting.id,
                userId: membership.userId,
                status,
              },
            });
          }
        }
      }
    }
  }

  console.log('🗳️ Creating polls and votes...');
  for (const club of createdClubs) {
    if (Math.random() > 0.4) { // 60% chance of having a poll
      const meetings = await prisma.meeting.findMany({
        where: { clubId: club.id },
      });

      if (meetings.length > 0) {
        const meeting = helpers.randomElement(meetings);
        const members = await prisma.membership.findMany({
          where: { clubId: club.id, status: 'ACTIVE' },
        });

        if (members.length > 0) {
          const creator = helpers.randomElement(members);
          const status = Math.random() > 0.6 ? 'OPEN' : 'CLOSED';
          const method = helpers.randomElement(['APPROVAL', 'RCV'] as const);

          const poll = await prisma.poll.create({
            data: {
              clubId: club.id,
              meetingId: meeting.id,
              createdBy: creator.userId,
              status,
              method,
            },
          });

          // Add poll options
          const numOptions = Math.floor(Math.random() * 3) + 2; // 2-4 options
          const optionBooks = helpers.randomElements(createdBooks, numOptions);
          const pollOptions = [];

          for (const book of optionBooks) {
            const proposer = helpers.randomElement(members);
            const option = await prisma.pollOption.create({
              data: {
                pollId: poll.id,
                bookId: book.id,
                proposerUserId: proposer.userId,
              },
            });
            pollOptions.push(option);
          }

          // Add votes
          for (const member of members) {
            if (Math.random() > 0.3) { // 70% voting participation
              for (const option of pollOptions) {
                if (method === 'APPROVAL') {
                  if (Math.random() > 0.6) { // 40% approval rate per option
                    await prisma.vote.create({
                      data: {
                        pollOptionId: option.id,
                        voterUserId: member.userId,
                        approved: true,
                      },
                    });
                  }
                } else { // RCV
                  if (Math.random() > 0.4) { // 60% chance to rank this option
                    await prisma.vote.create({
                      data: {
                        pollOptionId: option.id,
                        voterUserId: member.userId,
                        rank: Math.floor(Math.random() * numOptions) + 1,
                      },
                    });
                  }
                }
              }
            }
          }

          console.log(`    🗳️ Created poll for ${club.name} with ${pollOptions.length} options`);
        }
      }
    }
  }

  console.log('📖 Creating reading plans...');
  for (const club of createdClubs) {
    if (Math.random() > 0.5) { // 50% chance of having a reading plan
      const meetings = await prisma.meeting.findMany({
        where: { clubId: club.id },
        orderBy: { startsAt: 'asc' },
      });

      if (meetings.length >= 2) {
        const startMeeting = meetings[0];
        const endMeeting = meetings[Math.min(meetings.length - 1, Math.floor(Math.random() * 2) + 1)];
        const book = helpers.randomElement(createdBooks);

        await prisma.readingPlan.create({
          data: {
            clubId: club.id,
            bookId: book.id,
            startMeetingId: startMeeting.id,
            endMeetingId: endMeeting.id,
          },
        });

        console.log(`    📖 Created reading plan for ${club.name}: ${book.title}`);
      }
    }
  }

  console.log('✅ Seed completed successfully!');
  console.log('📊 Summary:');
  console.log(`   👥 Users: ${createdUsers.length}`);
  console.log(`   📚 Books: ${createdBooks.length}`);
  console.log(`   🏛️ Clubs: ${createdClubs.length}`);

  const totalMeetings = await prisma.meeting.count();
  const totalPolls = await prisma.poll.count();
  const totalShelfItems = await prisma.shelfItem.count();

  console.log(`   📅 Meetings: ${totalMeetings}`);
  console.log(`   🗳️ Polls: ${totalPolls}`);
  console.log(`   📋 Shelf Items: ${totalShelfItems}`);

  console.log('\n🔐 Test User Credentials:');
  console.log('   All users have the password: password123');
  console.log('   Test with any of these emails:');
  for (const user of seedUsers) {
    console.log(`   • ${user.email} (${user.name}, ${user.plan})`);
  }
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
