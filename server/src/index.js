require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const orderRoutes = require('./routes/orders');
const couponRoutes = require('./routes/coupons');
const galleryRoutes = require('./routes/gallery');
const analyticsRoutes = require('./routes/analytics');
const testimonialRoutes = require('./routes/testimonials');
const promoRoutes = require('./routes/promos');
const stockAlertRoutes = require('./routes/stockAlerts');
const prisma = require('./lib/prisma');

const app = express();
const port = process.env.PORT || 5000;
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((origin) => origin.trim()).filter(Boolean)
  : ['http://localhost:5173'];

app.set('trust proxy', 1);
app.disable('x-powered-by');

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(compression());
app.use(cors({
  origin(origin, callback) {
    const vercel = Boolean(origin && origin.includes('.vercel.app'));
    if (!origin || allowedOrigins.includes(origin) || vercel) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
}));
app.use(express.json({ limit: '1mb' }));

app.get('/', (req, res) => {
  res.json({ name: 'Sumptuous Braids API', status: 'healthy' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/db/status', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    const [productCount, adminCount, categoryCount] = await Promise.all([
      prisma.product.count(),
      prisma.admin.count(),
      prisma.category.count(),
    ]);

    res.json({
      status: 'connected',
      productCount,
      adminCount,
      categoryCount,
      hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
    });
  } catch (error) {
    console.error('Database status error:', error);
    res.status(500).json({
      status: 'database_error',
      code: error.code || error.name,
      message: error.code === 'P2021'
        ? 'Database tables are missing. Redeploy on Vercel so Prisma can push the schema.'
        : error.message,
      hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
    });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/promos', promoRoutes);
app.use('/api/stock-alerts', stockAlertRoutes);

app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/orders', orderRoutes);
app.use('/coupons', couponRoutes);
app.use('/gallery', galleryRoutes);
app.use('/analytics', analyticsRoutes);
app.use('/testimonials', testimonialRoutes);
app.use('/promos', promoRoutes);
app.use('/stock-alerts', stockAlertRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

app.use((error, req, res, next) => {
  console.error(error);

  if (error.name === 'ZodError') {
    return res.status(400).json({ message: 'Validation error.', errors: error.issues });
  }

  if (error.statusCode) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  if (error.code === 'P2002') {
    return res.status(409).json({ message: 'A record with this value already exists.' });
  }

  if (error.code === 'P2025') {
    return res.status(404).json({ message: 'Record not found.' });
  }

  if (error.code === 'P2021') {
    return res.status(500).json({
      message: 'Database tables are missing. Redeploy on Vercel so Prisma can push the schema.',
      code: error.code,
    });
  }

  if (error.code === 'P1001') {
    return res.status(500).json({
      message: 'Database server cannot be reached. Check DATABASE_URL on Vercel.',
      code: error.code,
    });
  }

  if (error.name === 'PrismaClientInitializationError') {
    return res.status(500).json({
      message: 'Prisma could not initialize. Check DATABASE_URL on Vercel.',
      code: error.errorCode || error.name,
    });
  }

  res.status(500).json({ message: 'Something went wrong.' });
});

module.exports = app;

if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Sumptuous Braids API running on port ${port}`);
  });
}
