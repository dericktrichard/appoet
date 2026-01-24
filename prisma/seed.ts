import { PrismaClient, PoemType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data (optional - be careful in production!)
  await prisma.samplePoem.deleteMany();
  await prisma.tier.deleteMany();

  // Create pricing tiers
  const quickPoem = await prisma.tier.create({
    data: {
      name: 'Quick Poem',
      description: 'Perfect for quick gifts, social media, and greeting cards',
      basePrice: 0.99,
      basePoemCount: 1, // 1 poem base
      bonusPoems: 1, // +1 for first-time customers
      baseDeliveryHours: 24,
      allowCustomization: false, // No customization for Quick Poem
      active: true,
    },
  });

  const customPoem = await prisma.tier.create({
    data: {
      name: 'Custom Poem',
      description: 'Fully customized poetry for special occasions and meaningful gifts',
      basePrice: 1.99,
      minPrice: 1.99,
      maxPrice: 10.00, // Suggested max
      basePoemCount: 2, // 2 poems base
      bonusPoems: 1, // +1 for first-time customers
      baseDeliveryHours: 12, // Base 12 hours, faster if they pay more
      allowCustomization: true, // Full customization
      active: true,
    },
  });

  console.log('✅ Created pricing tiers:', { quickPoem, customPoem });

  // Create sample poems
  const samples = await prisma.samplePoem.createMany({
    data: [
      {
        title: 'Morning Light',
        content: `Golden threads unfold
Across the quiet canvas—
Day begins to breathe.`,
        poemType: PoemType.HAIKU,
        visible: true,
        displayOrder: 1,
      },
      {
        title: 'For What Remains',
        content: `We kept the small things:
A button, smooth from your thumb,
The recipe card stained with oil and time,
Your laugh caught in the pause
Between the tick and tock.

Loss is not the absence
But the learning how to hold
What can't be held—
The shape of you in every empty chair,
The echo of your name
In rooms that know you're gone.`,
        poemType: PoemType.FREE_VERSE,
        visible: true,
        displayOrder: 2,
      },
      {
        title: 'First Steps',
        content: `Tiny toes on wooden floor,
Wobble, fall, then try once more—
Balance found in baby's eyes,
Watch them bloom before they fly.`,
        poemType: PoemType.LIMERICK,
        visible: true,
        displayOrder: 3,
      },
    ],
  });

  console.log('✅ Created sample poems:', samples.count);

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });