const express = require('express');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const asyncHandler = require('../utils/asyncHandler');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

const testimonialSchema = z.object({
  name: z.string().min(2),
  quote: z.string().min(8),
  location: z.string().optional().nullable(),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  isActive: z.boolean().default(true),
});

router.get('/', asyncHandler(async (req, res) => {
  const testimonials = await prisma.testimonial.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
    take: 12,
  });
  res.json({ testimonials });
}));

router.get('/admin/all', requireAdmin, asyncHandler(async (req, res) => {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' } });
  res.json({ testimonials });
}));

router.post('/', requireAdmin, asyncHandler(async (req, res) => {
  const data = testimonialSchema.parse(req.body);
  const testimonial = await prisma.testimonial.create({ data });
  res.status(201).json({ testimonial });
}));

router.put('/:id', requireAdmin, asyncHandler(async (req, res) => {
  const data = testimonialSchema.parse(req.body);
  const testimonial = await prisma.testimonial.update({ where: { id: req.params.id }, data });
  res.json({ testimonial });
}));

router.delete('/:id', requireAdmin, asyncHandler(async (req, res) => {
  await prisma.testimonial.delete({ where: { id: req.params.id } });
  res.json({ message: 'Testimonial deleted.' });
}));

module.exports = router;