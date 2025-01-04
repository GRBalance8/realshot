const { PrismaClient, UserRole } = require('@prisma/client');

const prisma = new PrismaClient();

async function makeAdmin(email: string) {
  try {
    // First check if the user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (!existingUser) {
      console.error(`User with email ${email} does not exist in the database`);
      return null;
    }

    // If user exists, proceed with update
    const user = await prisma.user.update({
      where: { email },
      data: {
        role: UserRole.ADMIN
      }
    });
    
    console.log(`Successfully made ${email} an admin`);
    return user;
  } catch (error) {
    console.error('Failed to update user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

const email = process.argv[2];
if (!email) {
  console.error('Please provide an email address');
  process.exit(1);
}

makeAdmin(email);
