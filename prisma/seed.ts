import { PrismaClient, Role, AccountStatus, MarketType, SignalAction } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: "admin@valgoo.ai" },
    update: { status: AccountStatus.ACTIVE },
    create: {
      name: "Platform Admin",
      email: "admin@valgoo.ai",
      phone: "+919999999999",
      passwordHash: await bcrypt.hash("Admin@123", 12),
      role: Role.ADMIN,
      status: AccountStatus.ACTIVE,
    },
  });

  const testUser = await prisma.user.upsert({
    where: { email: "trader@valgoo.ai" },
    update: { status: AccountStatus.ACTIVE },
    create: {
      name: "Test Trader",
      email: "trader@valgoo.ai",
      phone: "+919888888888",
      passwordHash: await bcrypt.hash("Test@123", 12),
      role: Role.USER,
      status: AccountStatus.ACTIVE,
      country: "India",
      experience: "Intermediate",
    },
  });

  const [goldAlgo, niftyAlgo] = await Promise.all([
    prisma.algo.upsert({
      where: { name: "Gold Algo" },
      update: {},
      create: {
        name: "Gold Algo",
        marketType: MarketType.FOREX,
        description: "Momentum signal generator for Gold (XAU/USD).",
      },
    }),
    prisma.algo.upsert({
      where: { name: "Nifty Algo" },
      update: {},
      create: {
        name: "Nifty Algo",
        marketType: MarketType.INDIA,
        description: "Trend-following signal generator for Nifty 50.",
      },
    }),
    prisma.algo.upsert({
      where: { name: "EUR-USD Algo" },
      update: {},
      create: {
        name: "EUR-USD Algo",
        marketType: MarketType.FOREX,
        description: "Mean-reversion signal generator for EUR/USD.",
      },
    }),
  ]);

  await prisma.userAlgo.upsert({
    where: { userId_algoId: { userId: testUser.id, algoId: goldAlgo.id } },
    update: { enabled: true, enabledAt: new Date() },
    create: {
      userId: testUser.id,
      algoId: goldAlgo.id,
      enabled: true,
      enabledAt: new Date(),
    },
  });

  await prisma.userAlgo.upsert({
    where: { userId_algoId: { userId: testUser.id, algoId: niftyAlgo.id } },
    update: {},
    create: {
      userId: testUser.id,
      algoId: niftyAlgo.id,
      enabled: false,
    },
  });

  const now = Date.now();
  await prisma.algoSignal.createMany({
    data: Array.from({ length: 6 }).map((_, i) => ({
      algoId: goldAlgo.id,
      instrument: "XAU/USD",
      signal: i % 2 === 0 ? SignalAction.BUY : SignalAction.SELL,
      metric: 2380 + Math.random() * 40,
      metricLabel: "price",
      timestamp: new Date(now - (6 - i) * 5 * 60 * 1000),
    })),
  });

  console.log("Seed complete:", { admin: admin.email, testUser: testUser.email });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
