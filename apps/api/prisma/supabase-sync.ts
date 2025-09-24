import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import { seedUsers } from './seed-data';

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

const DEFAULT_PASSWORD = 'password123';

async function createSupabaseUsers() {
  console.log('🔐 Creating Supabase auth users...');

  for (const userData of seedUsers) {
    try {
      const { data: authUser, error } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: DEFAULT_PASSWORD,
        email_confirm: true, // Auto-confirm for local development
        user_metadata: {
          name: userData.name,
          avatar_url: userData.avatarUrl,
        },
      });

      if (error) {
        if (error.message.includes('already registered')) {
          console.log(`  ⚠️ User ${userData.email} already exists in Supabase`);
        } else {
          console.error(`  ❌ Failed to create ${userData.email}:`, error.message);
        }
      } else {
        console.log(`  ✅ Created Supabase user: ${userData.name} (${userData.email})`);
      }
    } catch (error) {
      console.error(`  ❌ Error creating ${userData.email}:`, error);
    }
  }
}

async function syncSupabaseUsers() {
  console.log('🔄 Syncing users between Supabase and Prisma...');

  try {
    // Get all Supabase users
    const { data: supabaseUsers } = await supabase.auth.admin.listUsers();

    if (!supabaseUsers?.users) {
      console.log('  ⚠️ No Supabase users found');
      return;
    }

    console.log(`  Found ${supabaseUsers.users.length} Supabase users`);

    // Get all Prisma users
    const prismaUsers = await prisma.user.findMany();
    console.log(`  Found ${prismaUsers.length} Prisma users`);

    // Find users that exist in Supabase but not in Prisma
    const missingInPrisma = supabaseUsers.users.filter(
      (supabaseUser) => !prismaUsers.find((prismaUser) => prismaUser.id === supabaseUser.id)
    );

    // Find users that exist in Prisma but not in Supabase
    const missingInSupabase = prismaUsers.filter(
      (prismaUser) => !supabaseUsers.users.find((supabaseUser) => supabaseUser.id === prismaUser.id)
    );

    if (missingInPrisma.length > 0) {
      console.log(`  📝 Creating ${missingInPrisma.length} users in Prisma...`);

      for (const supabaseUser of missingInPrisma) {
        const userData = seedUsers.find(u => u.email === supabaseUser.email);
        if (userData) {
          await prisma.user.create({
            data: {
              id: supabaseUser.id,
              email: supabaseUser.email!,
              name: userData.name,
              avatarUrl: userData.avatarUrl,
              plan: userData.plan,
              shelvesVisibleTo: userData.shelvesVisibleTo,
            },
          });

          // Core shelves are automatically created by database trigger
          console.log(`    ✅ Created Prisma user: ${userData.name}`);
        }
      }
    }

    if (missingInSupabase.length > 0) {
      console.log(`  ⚠️ Found ${missingInSupabase.length} users in Prisma that don't exist in Supabase`);
      console.log('    Consider running the create command to add them to Supabase');
    }

    console.log('  ✅ Sync completed');

  } catch (error) {
    console.error('❌ Sync failed:', error);
  }
}

async function listUsers() {
  console.log('👥 Listing all users...');

  try {
    // Get Supabase users
    const { data: supabaseUsers } = await supabase.auth.admin.listUsers();

    // Get Prisma users
    const prismaUsers = await prisma.user.findMany();

    console.log('\n🔐 Supabase Auth Users:');
    if (supabaseUsers?.users) {
      supabaseUsers.users.forEach((user, index) => {
        console.log(`  ${index + 1}. ${user.email} (ID: ${user.id})`);
        console.log(`     Created: ${new Date(user.created_at).toLocaleDateString()}`);
        console.log(`     Confirmed: ${user.email_confirmed_at ? 'Yes' : 'No'}`);
      });
    } else {
      console.log('  No Supabase users found');
    }

    console.log('\n💾 Prisma Database Users:');
    if (prismaUsers.length > 0) {
      prismaUsers.forEach((user, index) => {
        console.log(`  ${index + 1}. ${user.name} (${user.email})`);
        console.log(`     ID: ${user.id}`);
        console.log(`     Plan: ${user.plan}`);
        console.log(`     Shelves Visibility: ${user.shelvesVisibleTo}`);
      });
    } else {
      console.log('  No Prisma users found');
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Supabase users: ${supabaseUsers?.users?.length || 0}`);
    console.log(`   Prisma users: ${prismaUsers.length}`);
    console.log(`\n🔑 Default password for all test users: ${DEFAULT_PASSWORD}`);

  } catch (error) {
    console.error('❌ Failed to list users:', error);
  }
}

// CLI handling
const command = process.argv[2];

async function main() {
  try {
    switch (command) {
      case 'create':
        await createSupabaseUsers();
        break;
      case 'sync':
        await syncSupabaseUsers();
        break;
      case 'list':
        await listUsers();
        break;
      default:
        console.log('📋 Supabase User Management');
        console.log('');
        console.log('Usage:');
        console.log('  pnpm db:create-supabase-users   # Create users in Supabase Auth');
        console.log('  pnpm db:sync-supabase-users     # Sync users between Supabase and Prisma');
        console.log('  tsx prisma/supabase-sync.ts list # List all users');
        console.log('');
        console.log('Available commands:');
        console.log('  create - Create all seed users in Supabase Auth');
        console.log('  sync   - Sync users between Supabase Auth and Prisma DB');
        console.log('  list   - Display all users from both systems');
    }
  } catch (error) {
    console.error('❌ Command failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
