const express = require('express');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const asyncHandler = require('../utils/asyncHandler');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

const promoSchema = z.object({
  title: z.string().min(2),
  message: z.string().min(4),
  linkLabel: z.string().optional().nullable(),
  linkUrl: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  startsAt: z.string().datetime().optional().nullable(),
  endsAt: z.string().datetime().optional().nullable(),
});

const activeWindow = { OR: [{ startsAt: null }, { startsAt: { lte: new Date() } }], AND: [{ OR: [{ endsAt: null }, { endsAt: { gte: new Date() } }] }] };

router.get('/active', asyncHandler(async (req, res) => {
  const banners = await prisma.promoBanner.findMany({ where: { isActive: true, ...activeWindow }, orderBy: { createdAt: 'desc' }, take: 3 });
  res.json({ banners });
}));

router.get('/', requireAdmin, asyncHandler(async (req, res) => {
  const banners = await prisma.promoBanner.findMany({ orderBy: { createdAt: 'desc' } });
  res.json({ banners });
}));

router.post('/', requireAdmin, asyncHandler(async (req, res) => {
  const data = promoSchema.parse(req.body);
  const banner = await prisma.promoBanner.create({ data: { ...data, startsAt: data.startsAt ? new Date(data.startsAt) : null, endsAt: data.endsAt ? new Date(data.endsAt) : null } });
  res.status(201).json({ banner });
}));

router.put('/:id', requireAdmin, asyncHandler(async (req, res) => {
  const data = promoSchema.parse(req.body);
  const banner = await prisma.promoBanner.update({ where: { id: req.params.id }, data: { ...data, startsAt: data.startsAt ? new Date(data.startsAt) : null, endsAt: data.endsAt ? new Date(data.endsAt) : null } });
  res.json({ banner });
}));

router.delete('/:id', requireAdmin, asyncHandler(async (req, res) => {
  await prisma.promoBanner.delete({ where: { id: req.params.id } });
  res.json({ message: 'Promo banner deleted.' });
}));

module.exports = router;