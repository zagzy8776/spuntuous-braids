# Sumptuous Braids

Professional braiding studio and branded hair-product store for Sumptuous Braids in Owerri.

The architecture matches the Roc Realm Perfumes production stack: React + Vite storefront, Express + Prisma API, WhatsApp checkout, and a full admin panel.

## Stack

- Frontend: React + Vite + Tailwind CSS, deployable on Vercel
- Backend: Express + Prisma, deployable on Render
- Database: PostgreSQL on Neon
- Current checkout: order saved to database and sent to WhatsApp

## Features

- Luxury homepage
- Shop / catalog
- Product detail, cart, wishlist, checkout
- Services and wholesale pages
- Style finder
- Gallery, blog, delivery information
- WhatsApp order and booking messages
- Admin dashboard, products, orders, gallery, coupons, promos, analytics

## Brand

- Studio: 86 Wethral Road, opposite Premium Trust Bank
- Phone / WhatsApp: 08070453422
- Email: Johnassumpta3@gmail.com
- Instagram: https://www.instagram.com/sumptuousbraids
- TikTok: https://www.tiktok.com/@sumptuousbraids
- Facebook: https://www.facebook.com/share/14msRH6cJ4t/

## Local Setup

### Backend

```bash
cd server
cp .env.example .env
npm install --include=dev
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

### Frontend

```bash
cd client
cp .env.example .env
npm install --include=dev
npm run dev
```

Set `VITE_WHATSAPP_NUMBER=2348070453422`.

## Default Seed Admin

- Email: `admin@sumptuousbraids.com`, or set `ADMIN_EMAIL`
- Password: `ChangeMe123!`

Change these in `server/.env` before deployment.

## Deployment

Same process as the perfume store:

- Neon PostgreSQL for `DATABASE_URL`
- Render for the `server` folder
- Vercel for the `client` folder
- Set `CLIENT_URL`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `VITE_API_URL`, and `VITE_WHATSAPP_NUMBER`

Do not commit real `.env` files.
