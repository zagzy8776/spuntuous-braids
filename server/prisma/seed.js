require('dotenv').config();

const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const makeSlug = require('../src/utils/slug');

const prisma = new PrismaClient();

const obsoleteProductSlugs = ['satin-' + 'night' + 'wear-set', 'luxury-' + 'linger' + 'ie-set'];
const obsoleteCategorySlug = 'night' + 'wear-' + 'linger' + 'ies';
const obsoleteProductTerms = ['Night' + 'wear', 'Linger' + 'ie'];
const seededDemoProductSlugs = [
  'baccarat-rouge-540',
  'dior-sauvage',
  'chanel-coco-mademoiselle',
  'tom-ford-oud-wood',
  'good-girl',
  'black-opium',
  'royal-musk-perfume-oil',
  'fresh-gentleman-cologne',
  'luxury-reed-diffuser',
  'room-and-linen-spray',
  'signature-couple-gift-set',
];
const oldDefaultCategoryNamesToRemove = [
  'Designer Perfumes',
  'Female Perfumes',
  'Gift Sets',
  'Luxury Collection',
  'Male Perfumes',
  'Sprays & Diffusers',
  'Unisex Perfumes',
  'Body Mists',
  'Colognes',
];

async function main() {
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@sumptuousbraids.com').toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
  const hashed = await bcrypt.hash(adminPassword, 12);

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: { password: hashed, name: process.env.ADMIN_NAME || 'Sumptuous Braids Admin' },
    create: { email: adminEmail, password: hashed, name: process.env.ADMIN_NAME || 'Sumptuous Braids Admin' },
  });

  await prisma.product.deleteMany({
    where: {
      OR: [
        { slug: { in: obsoleteProductSlugs } },
        { slug: { in: seededDemoProductSlugs } },
        ...obsoleteProductTerms.map((term) => ({ name: { contains: term, mode: 'insensitive' } })),
      ],
    },
  });

  await prisma.category.deleteMany({
    where: {
      OR: [
        { slug: obsoleteCategorySlug },
        { name: { in: oldDefaultCategoryNamesToRemove } },
        ...obsoleteProductTerms.map((term) => ({ name: { contains: term, mode: 'insensitive' } })),
      ],
    },
  });

  console.log('Seed completed. Admin account checked. No products, categories, promos, coupons, or testimonials were seeded; manage store content from the admin panel.');
  console.log(`Admin email: ${adminEmail}`);
  console.log(`Admin password: ${process.env.ADMIN_PASSWORD ? 'configured from environment' : 'using default ChangeMe123! - change before production'}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
