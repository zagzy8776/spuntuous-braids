const express = require('express');
const multer = require('multer');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const asyncHandler = require('../utils/asyncHandler');
const { requireAdmin } = require('../middleware/auth');
const makeSlug = require('../utils/slug');
const { formatProduct } = require('../utils/money');
const { uploadBufferToCloudinary } = require('../utils/cloudinaryUpload');

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 6 * 1024 * 1024 },
  fileFilter(req, file, callback) {
    if (!file.mimetype.startsWith('image/')) return callback(new Error('Only image files are allowed.'));
    callback(null, true);
  },
});

const productSchema = z.object({
  name: z.string().min(2),
  description: z.preprocess(
    (value) => (typeof value === 'string' ? value.trim() : value),
    z.string().optional().nullable(),
  ),

  price: z.coerce.number().positive(),
  costPrice: z.coerce.number().positive().optional().nullable(),
  salePrice: z.coerce.number().positive().optional().nullable(),
  size: z.string().optional().nullable(),
  gender: z.string().optional().nullable(),
  scentFamily: z.string().optional().nullable(),
  occasion: z.string().optional().nullable(),
  brandType: z.string().optional().nullable(),
  notes: z.array(z.string()).default([]),
  images: z.array(z.string().url()).default([]),
  stock: z.coerce.number().int().min(0).default(0),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  categoryId: z.string().optional().nullable(),
});

const normalizeProductData = (data) => ({
  ...data,
  description: data.description || '',
  costPrice: data.costPrice || null,
  salePrice: data.salePrice || null,
  categoryId: data.categoryId || null,
});

router.get('/', asyncHandler(async (req, res) => {
  const { search, category, featured, active, page, limit, availability, sort } = req.query;
  const pageNumber = Math.max(1, Number(page || 1));
  const pageSize = Math.min(48, Math.max(1, Number(limit || 24)));
  const skip = (pageNumber - 1) * pageSize;

  const where = {
    isActive: active === 'false' ? undefined : true,
    isFeatured: featured === 'true' ? true : undefined,

    category: category ? { slug: String(category) } : undefined,
    stock: availability === 'available' ? { gt: 0 } : undefined,
    OR: search ? [
      { name: { contains: String(search), mode: 'insensitive' } },
      { description: { contains: String(search), mode: 'insensitive' } },
    ] : undefined,
  };

  const orderBy = sort === 'low'
    ? { price: 'asc' }
    : sort === 'high'
      ? { price: 'desc' }
      : { createdAt: 'desc' };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: pageSize,
      include: { category: true },
      orderBy,
    }),
    prisma.product.count({ where }),
  ]);

  res.json({
    products: products.map(formatProduct),
    pagination: {
      page: pageNumber,
      limit: pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
      hasMore: pageNumber * pageSize < total,
    },
  });
}));

router.get('/admin/all', requireAdmin, asyncHandler(async (req, res) => {
  const products = await prisma.product.findMany({ include: { category: true }, orderBy: { createdAt: 'desc' } });
  res.json({ products: products.map(formatProduct) });
}));

router.post('/upload-image', requireAdmin, upload.single('image'), asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Please choose a product image.' });
  const result = await uploadBufferToCloudinary(req.file, 'roc-realm-products');
  res.status(201).json({ imageUrl: result.secure_url, publicId: result.public_id });
}));

router.get('/:slug', asyncHandler(async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { slug: req.params.slug },
    include: { category: true },
  });

  if (!product || !product.isActive) {
    return res.status(404).json({ message: 'Product not found.' });
  }

  res.json({ product: formatProduct(product) });
}));

router.post('/', requireAdmin, asyncHandler(async (req, res) => {
  const data = productSchema.parse(req.body);
  const baseSlug = makeSlug(data.name);
  const existing = await prisma.product.count({ where: { slug: { startsWith: baseSlug } } });
  const slug = existing ? `${baseSlug}-${existing + 1}` : baseSlug;

  const product = await prisma.product.create({
    data: { ...normalizeProductData(data), slug },

    include: { category: true },
  });

  res.status(201).json({ product: formatProduct(product) });
}));

router.put('/:id', requireAdmin, asyncHandler(async (req, res) => {
  const data = productSchema.parse(req.body);
  const current = await prisma.product.findUnique({ where: { id: req.params.id } });
  if (!current) return res.status(404).json({ message: 'Product not found.' });

  const baseSlug = makeSlug(data.name);
  const conflicting = await prisma.product.count({ where: { slug: { startsWith: baseSlug }, id: { not: req.params.id } } });
  const nextSlug = current.name === data.name ? current.slug : (conflicting ? `${baseSlug}-${conflicting + 1}` : baseSlug);
  const product = await prisma.product.update({
    where: { id: req.params.id },
    data: { ...normalizeProductData(data), slug: nextSlug },

    include: { category: true },
  });

  res.json({ product: formatProduct(product) });
}));

router.delete('/:id', requireAdmin, asyncHandler(async (req, res) => {
  await prisma.product.delete({ where: { id: req.params.id } });
  res.json({ message: 'Product deleted.' });
}));

module.exports = router;
