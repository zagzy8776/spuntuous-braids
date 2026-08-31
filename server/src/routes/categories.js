const express = require('express');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const asyncHandler = require('../utils/asyncHandler');
const { requireAdmin } = require('../middleware/auth');
const makeSlug = require('../utils/slug');

const router = express.Router();

const categorySchema = z.object({
  name: z.string().min(2),
  description: z.string().optional().nullable(),
});

router.get('/', asyncHandler(async (req, res) => {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: 'asc' },
  });
  res.json({ categories });
}));

router.post('/', requireAdmin, asyncHandler(async (req, res) => {
  const data = categorySchema.parse(req.body);
  const category = await prisma.category.create({ data: { ...data, slug: makeSlug(data.name) } });
  res.status(201).json({ category });
}));

router.put('/:id', requireAdmin, asyncHandler(async (req, res) => {
  const data = categorySchema.parse(req.body);
  const category = await prisma.category.update({
    where: { id: req.params.id },
    data: { ...data, slug: makeSlug(data.name) },
  });
  res.json({ category });
}));

router.delete('/:id', requireAdmin, asyncHandler(async (req, res) => {
  await prisma.category.delete({ where: { id: req.params.id } });
  res.json({ message: 'Category deleted.' });
}));

module.exports = router;
