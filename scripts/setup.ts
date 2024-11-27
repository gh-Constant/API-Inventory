import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    // Create test account
    const hashedPassword = await bcrypt.hash('0422', 10);
    await prisma.user.upsert({
      where: { username: 'Constant' },
      update: {},
      create: {
        username: 'Constant',
        password: hashedPassword,
        apiKey: 'test_api_key_constant',
      },
    });

    // Create some sample items
    const sampleItems = [
      {
        name: 'Dragon Sword',
        type: 'weapon',
        rarity: 'legendary',
        stats: JSON.stringify({
          damage: 150,
          durability: 1000,
          level: 50,
        }),
      },
      {
        name: 'Healing Potion',
        type: 'consumable',
        rarity: 'common',
        stats: JSON.stringify({
          healing: 50,
          duration: 5,
        }),
      },
      {
        name: 'Ancient Shield',
        type: 'armor',
        rarity: 'epic',
        stats: JSON.stringify({
          defense: 100,
          weight: 15,
          magicResistance: 30,
        }),
      },
      {
        name: 'Swift Boots',
        type: 'armor',
        rarity: 'rare',
        stats: JSON.stringify({
          speed: 25,
          agility: 15,
          stamina: 20,
        }),
      },
    ];

    for (const item of sampleItems) {
      await prisma.item.upsert({
        where: { name: item.name },
        update: {},
        create: item,
      });
    }

    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

export function someFunction() {
  // ...
}

export const someVariable = 'value';

export default function mainFunction() {
  // ...
}