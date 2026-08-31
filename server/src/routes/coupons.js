const express = require('express');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const asyncHandler = require('../utils/asyncHandler');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

const couponSchema = z.object({
  code: z.string().min(3),
  type: z.enum(['PERCENTAGE', 'FIXED']),
  value: z.coerce.number().positive(),
  isActive: z.boolean().default(true),
  expiresAt: z.string().datetime().optional().nullable(),
});

const serializeCoupon = (coupon) => coupon ? { ...coupon, value: Number(coupon.value) } : null;

const calculateDiscount = (coupon, subtotal) => {
  if (!coupon) return 0;
  const value = Number(coupon.value);
  if (coupon.type === 'PERCENTAGE') return Math.min(subtotal, (subtotal * value) / 100);
  return Math.min(subtotal, value);
};

router.get('/', requireAdmin, asyncHandler(async (req, res) => {
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
  res.json({ coupons: coupons.map(serializeCoupon) });
}));

router.post('/validate', asyncHandler(async (req, res) => {
  const schema = z.object({ code: z.string().min(3), subtotal: z.coerce.number().min(0) });
  const { code, subtotal } = schema.parse(req.body);
  const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });

  if (!coupon || !coupon.isActive || (coupon.expiresAt && coupon.expiresAt < new Date())) {
    return res.status(404).json({ message: 'Coupon is invalid or expired.' });
  }

  const discount = calculateDiscount(coupon, subtotal);
  res.json({ coupon: serializeCoupon(coupon), discount, total: Math.max(0, subtotal - discount) });
}));

router.post('/', requireAdmin, asyncHandler(async (req, res) => {
  const data = couponSchema.parse(req.body);
  const coupon = await prisma.coupon.create({
    data: { ...data, code: data.code.toUpperCase(), expiresAt: data.expiresAt ? new Date(data.expiresAt) : null },
  });
  res.status(201).json({ coupon: serializeCoupon(coupon) });
}));

router.put('/:id', requireAdmin, asyncHandler(async (req, res) => {
  const data = couponSchema.parse(req.body);
  const coupon = await prisma.coupon.update({
    where: { id: req.params.id },
    data: { ...data, code: data.code.toUpperCase(), expiresAt: data.expiresAt ? new Date(data.expiresAt) : null },
  });
  res.json({ coupon: serializeCoupon(coupon) });
}));

router.delete('/:id', requireAdmin, asyncHandler(async (req, res) => {
  await prisma.coupon.delete({ where: { id: req.params.id } });
  res.json({ message: 'Coupon deleted.' });
}));

module.exports = router;
module.exports.calculateDiscount = calculateDiscount;
