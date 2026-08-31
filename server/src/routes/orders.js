const express = require('express');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const asyncHandler = require('../utils/asyncHandler');
const { requireAdmin } = require('../middleware/auth');
const { formatOrder } = require('../utils/money');
const { calculateDiscount } = require('./coupons');

const router = express.Router();

const bankDetails = {
  bankName: 'Confirm on WhatsApp',
  accountNumber: 'Request account details',
  accountName: 'Sumptuous Braids',
};

const deliveryFees = {
  PICKUP: 0,
  OWERRI_DELIVERY: 3000,
  WAYBILL_PARK: 1000,
  OTHER_STATES_DISPATCH: 0,
};

const orderSchema = z.object({
  customerName: z.string().min(2),
  customerPhone: z.string().min(7),
  customerEmail: z.string().email().optional().or(z.literal('')).nullable(),
  deliveryAddress: z.string().min(5),
  deliveryCity: z.string().optional().nullable(),
  deliveryNote: z.string().optional().nullable(),
  deliveryMethod: z.enum(['PICKUP', 'OWERRI_DELIVERY', 'WAYBILL_PARK', 'OTHER_STATES_DISPATCH']).default('PICKUP'),
  paymentMethod: z.enum(['BANK_TRANSFER', 'PAY_ON_DELIVERY', 'WHATSAPP_CONFIRMATION']),
  couponCode: z.string().optional().nullable(),
  source: z.string().optional().nullable(),
  medium: z.string().optional().nullable(),
  campaign: z.string().optional().nullable(),
  items: z.array(z.object({ productId: z.string(), quantity: z.coerce.number().int().positive() })).min(1),
});

const makeOrderNumber = () => `RRP-${Date.now().toString().slice(-8)}-${Math.floor(Math.random() * 900 + 100)}`;

router.post('/', asyncHandler(async (req, res) => {
  const data = orderSchema.parse(req.body);
  const ids = data.items.map((item) => item.productId);
  const products = await prisma.product.findMany({ where: { id: { in: ids }, isActive: true } });

  if (products.length !== ids.length) {
    return res.status(400).json({ message: 'One or more products are unavailable.' });
  }

  const productMap = new Map(products.map((product) => [product.id, product]));
  const orderItems = data.items.map((item) => {
    const product = productMap.get(item.productId);
    if (item.quantity > product.stock) {
      const error = new Error(`${product.name} has only ${product.stock} available.`);
      error.statusCode = 400;
      throw error;
    }
    const unitPrice = Number(product.salePrice || product.price);
    return {
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      productImage: product.images[0] || null,
      productPrice: unitPrice,
      quantity: item.quantity,
      total: unitPrice * item.quantity,
    };
  });

  const subtotal = orderItems.reduce((sum, item) => sum + item.total, 0);
  let coupon = null;
  if (data.couponCode) {
    coupon = await prisma.coupon.findUnique({ where: { code: data.couponCode.toUpperCase() } });
    if (!coupon || !coupon.isActive || (coupon.expiresAt && coupon.expiresAt < new Date())) coupon = null;
  }

  const discount = calculateDiscount(coupon, subtotal);
  const deliveryFee = deliveryFees[data.deliveryMethod] || 0;
  const total = Math.max(0, subtotal - discount + deliveryFee);

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        orderNumber: makeOrderNumber(),
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail || null,
        deliveryAddress: data.deliveryAddress,
        deliveryCity: data.deliveryCity || null,
        deliveryNote: data.deliveryNote || null,
        deliveryMethod: data.deliveryMethod,
        deliveryFee,
        paymentMethod: data.paymentMethod,
        paymentStatus: data.paymentMethod === 'PAY_ON_DELIVERY' ? 'UNPAID' : 'UNPAID',
        couponCode: coupon?.code || null,
        bankName: bankDetails.bankName,
        accountNumber: bankDetails.accountNumber,
        accountName: bankDetails.accountName,
        source: data.source || null,
        medium: data.medium || null,
        campaign: data.campaign || null,
        subtotal,
        discount,
        total,
        items: { create: orderItems },
      },
      include: { items: true },
    });

    await Promise.all(data.items.map((item) => tx.product.update({
      where: { id: item.productId },
      data: { stock: { decrement: item.quantity } },
    })));

    return created;
  });

  res.status(201).json({ order: formatOrder(order) });
}));

router.get('/', requireAdmin, asyncHandler(async (req, res) => {
  const orders = await prisma.order.findMany({ include: { items: true }, orderBy: { createdAt: 'desc' } });
  res.json({ orders: orders.map(formatOrder) });
}));

router.get('/stats/summary', requireAdmin, asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const [orders, products, pendingOrders, outOfStockProducts, todayOrders, monthOrders, orderItems, visitors, productList] = await Promise.all([
    prisma.order.findMany({ where: { status: { not: 'CANCELLED' } } }),
    prisma.product.count(),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.product.count({ where: { stock: 0 } }),
    prisma.order.findMany({ where: { status: { not: 'CANCELLED' }, createdAt: { gte: today } } }),
    prisma.order.findMany({ where: { status: { not: 'CANCELLED' }, createdAt: { gte: monthStart } } }),
    prisma.orderItem.findMany(),
    prisma.visitorEvent.groupBy({ by: ['productSlug'], _count: { productSlug: true }, where: { productSlug: { not: null } } }),
    prisma.product.findMany({ select: { id: true, name: true, slug: true, costPrice: true } }),
  ]);

  const totalSales = orders.reduce((sum, order) => sum + Number(order.total), 0);
  const revenueToday = todayOrders.reduce((sum, order) => sum + Number(order.total), 0);
  const revenueThisMonth = monthOrders.reduce((sum, order) => sum + Number(order.total), 0);
  const averageOrderValue = orders.length ? totalSales / orders.length : 0;
  const costMap = new Map(productList.map((product) => [product.id, Number(product.costPrice || 0)]));
  const totalCost = orderItems.reduce((sum, item) => sum + ((costMap.get(item.productId) || 0) * item.quantity), 0);
  const grossProfit = totalSales - totalCost;
  const profitMargin = totalSales ? (grossProfit / totalSales) * 100 : 0;
  const bestSellingMap = new Map();
  orderItems.forEach((item) => {
    const key = item.productSlug || item.productName;
    const current = bestSellingMap.get(key) || { productName: item.productName, productSlug: item.productSlug, quantity: 0, revenue: 0, cost: 0, profit: 0 };
    current.quantity += item.quantity;
    current.revenue += Number(item.total);
    current.cost += (costMap.get(item.productId) || 0) * item.quantity;
    current.profit = current.revenue - current.cost;
    bestSellingMap.set(key, current);
  });
  const productViewMap = new Map(visitors.map((item) => [item.productSlug, item._count.productSlug]));
  const bestSellingProducts = [...bestSellingMap.values()].sort((a, b) => b.quantity - a.quantity).slice(0, 8);
  const viewedNotSelling = [...productViewMap.entries()].map(([slug, views]) => ({ slug, views, sold: bestSellingMap.get(slug)?.quantity || 0 })).filter((item) => item.views > 0 && item.sold === 0).sort((a, b) => b.views - a.views).slice(0, 8);
  const sourceRevenue = orders.reduce((acc, order) => {
    const source = order.source || 'Unknown';
    acc[source] = (acc[source] || 0) + Number(order.total);
    return acc;
  }, {});
  const repeatCustomers = Object.values(orders.reduce((acc, order) => {
    const key = order.customerPhone.replace(/\D/g, '');
    acc[key] ||= { name: order.customerName, phone: order.customerPhone, orders: 0, totalSpent: 0 };
    acc[key].orders += 1;
    acc[key].totalSpent += Number(order.total);
    return acc;
  }, {})).filter((item) => item.orders > 1).sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 8);

  res.json({ totalProducts: products, totalOrders: orders.length, pendingOrders, outOfStockProducts, totalSales, revenueToday, revenueThisMonth, averageOrderValue, totalCost, grossProfit, profitMargin, bestSellingProducts, viewedNotSelling, sourceRevenue, repeatCustomers });
}));

router.get('/payment/bank-details', (req, res) => {
  res.json({ bankDetails });
});

router.get('/customers/summary', requireAdmin, asyncHandler(async (req, res) => {
  const orders = await prisma.order.findMany({ include: { items: true }, orderBy: { createdAt: 'desc' } });
  const customers = Object.values(orders.reduce((acc, order) => {
    const key = order.customerPhone.replace(/\D/g, '') || order.customerPhone;
    acc[key] ||= { name: order.customerName, phone: order.customerPhone, email: order.customerEmail, totalOrders: 0, totalSpent: 0, lastOrderDate: order.createdAt, categories: {}, products: {} };
    acc[key].totalOrders += 1;
    acc[key].totalSpent += Number(order.total);
    if (new Date(order.createdAt) > new Date(acc[key].lastOrderDate)) acc[key].lastOrderDate = order.createdAt;
    order.items.forEach((item) => { acc[key].products[item.productName] = (acc[key].products[item.productName] || 0) + item.quantity; });
    return acc;
  }, {})).map((customer) => ({
    ...customer,
    favoriteProduct: Object.entries(customer.products).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Not enough data',
    products: undefined,
    categories: undefined,
  })).sort((a, b) => b.totalSpent - a.totalSpent);

  res.json({ customers });
}));

router.get('/:id', requireAdmin, asyncHandler(async (req, res) => {
  const order = await prisma.order.findUnique({ where: { id: req.params.id }, include: { items: true } });
  if (!order) return res.status(404).json({ message: 'Order not found.' });
  res.json({ order: formatOrder(order) });
}));

router.put('/:id/status', requireAdmin, asyncHandler(async (req, res) => {
  const schema = z.object({ status: z.enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'DELIVERED', 'CANCELLED']) });
  const { status } = schema.parse(req.body);
  const order = await prisma.order.update({ where: { id: req.params.id }, data: { status }, include: { items: true } });
  res.json({ order: formatOrder(order) });
}));

router.put('/:id/payment-reported', asyncHandler(async (req, res) => {
  const order = await prisma.order.update({ where: { id: req.params.id }, data: { paymentStatus: 'PAYMENT_REPORTED', paymentReportedAt: new Date() }, include: { items: true } });
  res.json({ order: formatOrder(order) });
}));

router.put('/:id/payment-status', requireAdmin, asyncHandler(async (req, res) => {
  const schema = z.object({ paymentStatus: z.enum(['UNPAID', 'PAYMENT_REPORTED', 'PAID']) });
  const { paymentStatus } = schema.parse(req.body);
  const order = await prisma.order.update({
    where: { id: req.params.id },
    data: { paymentStatus, paidAt: paymentStatus === 'PAID' ? new Date() : null },
    include: { items: true },
  });
  res.json({ order: formatOrder(order) });
}));

router.put('/:id/manual-discount', requireAdmin, asyncHandler(async (req, res) => {
  const schema = z.object({ manualDiscount: z.coerce.number().min(0), discountReason: z.string().optional().nullable() });
  const { manualDiscount, discountReason } = schema.parse(req.body);
  const current = await prisma.order.findUnique({ where: { id: req.params.id }, include: { items: true } });
  if (!current) return res.status(404).json({ message: 'Order not found.' });
  const total = Math.max(0, Number(current.subtotal) - Number(current.discount) - manualDiscount + Number(current.deliveryFee || 0));
  const order = await prisma.order.update({ where: { id: req.params.id }, data: { manualDiscount, discountReason: discountReason || null, total }, include: { items: true } });
  res.json({ order: formatOrder(order) });
}));

module.exports = router;
