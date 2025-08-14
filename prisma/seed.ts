import {
  PrismaClient,
  UserRole,
  UserStatus,
  AuthProvider,
} from "@prisma/client";
import { AuthUtils } from "../src/lib/auth";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Clean up existing data
  await prisma.userLog.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();

  console.log("🧹 Cleaned up existing data");

  // Create Super Admin
  const superAdminPassword = await AuthUtils.hashPassword("superadmin123");
  const superAdmin = await prisma.user.create({
    data: {
      email: "superadmin@mymentor.com",
      username: "superadmin",
      firstName: "Super",
      lastName: "Admin",
      displayName: "Super Administrator",
      password: superAdminPassword,
      role: UserRole.SUPERADMIN,
      status: UserStatus.ACTIVE,
      emailVerified: true,
      authProvider: AuthProvider.LOCAL,
      bio: "System Super Administrator",
      phone: "+1234567890",
      location: "Global",
      timezone: "UTC",
      language: "en",
      currency: "USD",
      website: "https://mymentor.com",
      socialLinks: {
        linkedin: "https://linkedin.com/in/superadmin",
        twitter: "https://twitter.com/superadmin",
      },
      preferences: {
        theme: "dark",
        notifications: {
          email: true,
          push: true,
          sms: false,
        },
      },
    },
  });

  // Log the seeding actions
  await AuthUtils.logUserAction({
    userId: superAdmin.id,
    action: "USER_CREATED",
    details: { role: "SUPERADMIN", method: "SEED" },
  });

  console.log("✅ Database seeding completed!");
  console.log(`👥 Created 1 user:`);
  console.log(`   - 1 Super Admin: ${superAdmin.email}`);
  console.log("");
  console.log("🔑 Default password:");
  console.log("   - Super Admin: superadmin123");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
