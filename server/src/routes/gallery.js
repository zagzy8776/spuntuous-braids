const express = require('express');
const multer = require('multer');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const asyncHandler = require('../utils/asyncHandler');
const { requireAdmin } = require('../middleware/auth');
const { cloudinary, hasCloudinary, uploadBufferToCloudinary } = require('../utils/cloudinaryUpload');

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 6 * 1024 * 1024 },
  fileFilter(req, file, callback) {
    if (!file.mimetype.startsWith('image/')) return callback(new Error('Only image files are allowed.'));
    callback(null, true);
  },
});

const serializeImage = (image) => image;

router.get('/', asyncHandler(async (req, res) => {
  const includeInactive = req.query.active === 'false';
  const page = Math.max(1, Number(req.query.page || 1));
  const limit = Math.min(48, Math.max(6, Number(req.query.limit || 24)));
  const search = req.query.search ? String(req.query.search) : '';
  const featured = req.query.featured === 'true';
  const where = {
    isActive: includeInactive ? undefined : true,
    isFeatured: featured ? true : undefined,
    OR: search ? [
      { title: { contains: search, mode: 'insensitive' } },
      { caption: { contains: search, mode: 'insensitive' } },
    ] : undefined,
  };

  const [images, total] = await Promise.all([
    prisma.galleryImage.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
    }),
    prisma.galleryImage.count({ where }),
  ]);

  res.json({
    images: images.map(serializeImage),
    pagination: { page, limit, total, hasMore: page * limit < total },
  });
}));

router.get('/featured', asyncHandler(async (req, res) => {
  const images = await prisma.galleryImage.findMany({
    where: { isActive: true, isFeatured: true },
    take: 12,
    orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
  });
  res.json({ images: images.map(serializeImage) });
}));

router.get('/admin/all', requireAdmin, asyncHandler(async (req, res) => {
  const images = await prisma.galleryImage.findMany({ orderBy: { createdAt: 'desc' } });
  res.json({ images: images.map(serializeImage) });
}));

router.get('/upload-status', requireAdmin, (req, res) => {
  res.json({
    cloudinaryConfigured: hasCloudinary(),
    requiredEnv: ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'],
  });
});

router.post('/', requireAdmin, upload.single('image'), asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Please choose an image to upload.' });
  const result = await uploadBufferToCloudinary(req.file, 'roc-realm-gallery');

  const image = await prisma.galleryImage.create({
    data: {
      title: req.body.title || null,
      caption: req.body.caption || null,
      imageUrl: result.secure_url,
      publicId: result.public_id,
      isFeatured: req.body.isFeatured === 'true',
      isActive: req.body.isActive !== 'false',
    },
  });

  res.status(201).json({ image: serializeImage(image) });
}));

router.post('/url', requireAdmin, asyncHandler(async (req, res) => {
  const schema = z.object({
    title: z.string().optional().nullable(),
    caption: z.string().optional().nullable(),
    imageUrl: z.string().url(),
    isFeatured: z.boolean().default(false),
    isActive: z.boolean().default(true),
  });
  const data = schema.parse(req.body);
  const image = await prisma.galleryImage.create({ data });
  res.status(201).json({ image: serializeImage(image) });
}));

router.put('/:id', requireAdmin, asyncHandler(async (req, res) => {
  const schema = z.object({
    title: z.string().optional().nullable(),
    caption: z.string().optional().nullable(),
    isFeatured: z.boolean(),
    isActive: z.boolean(),
  });
  const data = schema.parse(req.body);
  const image = await prisma.galleryImage.update({ where: { id: req.params.id }, data });
  res.json({ image: serializeImage(image) });
}));

router.delete('/:id', requireAdmin, asyncHandler(async (req, res) => {
  const image = await prisma.galleryImage.findUnique({ where: { id: req.params.id } });
  if (!image) return res.status(404).json({ message: 'Gallery image not found.' });

  if (image.publicId && hasCloudinary()) {
    await cloudinary.uploader.destroy(image.publicId).catch(() => null);
  }

  await prisma.galleryImage.delete({ where: { id: req.params.id } });
  res.json({ message: 'Gallery image deleted.' });
}));

module.exports = router;
