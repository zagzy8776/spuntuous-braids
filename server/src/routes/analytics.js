const crypto = require('crypto');
const express = require('express');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const asyncHandler = require('../utils/asyncHandler');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

const eventSchema = z.object({
  sessionId: z.string().max(120).optional().nullable(),
  path: z.string().min(1).max(500),
  title: z.string().max(180).optional().nullable(),
  referrer: z.string().max(500).optional().nullable(),
  source: z.string().max(80).optional().nullable(),
  device: z.string().max(40).optional().nullable(),
  browser: z.string().max(80).optional().nullable(),
  productSlug: z.string().max(180).optional().nullable(),
});

const hashIp = (value = '') => {
  if (!value) return null;
  return crypto.createHash('sha256').update(`${value}:${process.env.JWT_SECRET || 'roc-realm'}`).digest('hex');
};

const startOfDay = (date = new Date()) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const daysAgo = (days) => {
  const date = startOfDay();
  date.setDate(date.getDate() - days);
  return date;
};

router.post('/track', asyncHandler(async (req, res) => {
  const data = eventSchema.parse(req.body);
  await prisma.visitorEvent.create({
    data: {
      ...data,
      referrer: data.referrer || null,
      source: data.source || 'Direct',
      ipHash: hashIp(req.ip || req.headers['x-forwarded-for']),
    },
  });
  res.status(201).json({ ok: true });
}));

router.get('/summary', requireAdmin, asyncHandler(async (req, res) => {
  const today = startOfDay();
  const sevenDays = daysAgo(6);
  const thirtyDays = daysAgo(29);

  const [todayVisits, sevenDayVisits, thirtyDayVisits, uniqueSessions, recentVisits, popularPages, popularProducts, topSources, deviceBreakdown] = await Promise.all([
    prisma.visitorEvent.count({ where: { createdAt: { gte: today } } }),
    prisma.visitorEvent.count({ where: { createdAt: { gte: sevenDays } } }),
    prisma.visitorEvent.count({ where: { createdAt: { gte: thirtyDays } } }),
    prisma.visitorEvent.groupBy({ by: ['sessionId'], where: { createdAt: { gte: thirtyDays }, sessionId: { not: null } } }),
    prisma.visitorEvent.findMany({ take: 12, orderBy: { createdAt: 'desc' } }),
    prisma.visitorEvent.groupBy({ by: ['path'], _count: { path: true }, where: { createdAt: { gte: thirtyDays } }, orderBy: { _count: { path: 'desc' } }, take: 8 }),
    prisma.visitorEvent.groupBy({ by: ['productSlug'], _count: { productSlug: true }, where: { createdAt: { gte: thirtyDays }, productSlug: { not: null } }, orderBy: { _count: { productSlug: 'desc' } }, take: 8 }),
    prisma.visitorEvent.groupBy({ by: ['source'], _count: { source: true }, where: { createdAt: { gte: thirtyDays } }, orderBy: { _count: { source: 'desc' } }, take: 8 }),
    prisma.visitorEvent.groupBy({ by: ['device'], _count: { device: true }, where: { createdAt: { gte: thirtyDays } }, orderBy: { _count: { device: 'desc' } }, take: 5 }),
  ]);

  res.json({
    todayVisits,
    sevenDayVisits,
    thirtyDayVisits,
    uniqueVisitors30d: uniqueSessions.length,
    recentVisits,
    popularPages: popularPages.map((item) => ({ path: item.path, visits: item._count.path })),
    popularProducts: popularProducts.map((item) => ({ slug: item.productSlug, views: item._count.productSlug })),
    topSources: topSources.map((item) => ({ source: item.source || 'Direct', visits: item._count.source })),
    deviceBreakdown: deviceBreakdown.map((item) => ({ device: item.device || 'Unknown', visits: item._count.device })),
  });
}));

module.exports = router;