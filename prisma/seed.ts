import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

// sortOrder defines the display order in the UI. Steps of 10 leave room to
// insert a genre between existing ones without renumbering the whole list.
const genres = [
  { name: 'Роман', sortOrder: 10 },
  { name: 'Фантастика', sortOrder: 20 },
  { name: 'Детектив', sortOrder: 30 },
  { name: 'Классика', sortOrder: 40 },
  { name: 'Психология', sortOrder: 50 },
  { name: 'Саморазвитие', sortOrder: 60 },
  { name: 'Философия', sortOrder: 70 },
  { name: 'Биография', sortOrder: 80 },
  { name: 'История', sortOrder: 90 },
  { name: 'Научпоп', sortOrder: 100 },
  { name: 'Поэзия', sortOrder: 110 },
  { name: 'Программирование', sortOrder: 120 },
  { name: 'Дизайн', sortOrder: 130 },
  { name: 'Юмор', sortOrder: 140 },
];

async function main(): Promise<void> {
  // upsert instead of createMany: re-running the seed refreshes sortOrder on
  // genres that already exist, instead of silently skipping them.
  for (const genre of genres) {
    await prisma.genre.upsert({
      where: { name: genre.name },
      update: { sortOrder: genre.sortOrder },
      create: genre,
    });
  }

  console.log(`Genres seeded: ${genres.length}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
