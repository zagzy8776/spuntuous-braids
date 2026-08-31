const express = require('express');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const asyncHandler = require('../utils/asyncHandler');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

const alertSchema = z.object({
  productId: z.string().optional().nullable(),
  productName: z.string().min(2),
  productSlug: z.string().optional().nullable(),
  customerName: z.string().optional().nullable(),
  phone: z.string().min(7),
  message: z.string().optional().nullable(),
});

router.post('/', asyncHandler(async (req, res) => {
  const data = alertSchema.parse(req.body);
  const alert = await prisma.stockAlert.create({ data });
  res.status(201).json({ alert });
}));

router.get('/', requireAdmin, asyncHandler(async (req, res) => {
  const alerts = await prisma.stockAlert.findMany({ orderBy: { createdAt: 'desc' } });
  res.json({ alerts });
}));

router.put('/:id/contacted', requireAdmin, asyncHandler(async (req, res) => {
  const alert = await prisma.stockAlert.update({ where: { id: req.params.id }, data: { isContacted: true } });
  res.json({ alert });
}));

router.delete('/:id', requireAdmin, asyncHandler(async (req, res) => {
  await prisma.stockAlert.delete({ where: { id: req.params.id } });
  res.json({ message: 'Stock alert deleted.' });
}));

module.exports = router;