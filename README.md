# Sumptuous Braids

Professional braiding studio site. Frontend and API both deploy on Vercel.

## Stack

- Frontend: React + Vite + Tailwind on Vercel
- API: Express serverless function on the same Vercel project
- Database: Neon PostgreSQL (`DATABASE_URL` only)
- Images: unsigned Cloudinary upload (cloud name + upload preset)

## Vercel environment variables

```
DATABASE_URL=postgresql://...neon.tech/neondb?sslmode=require
JWT_SECRET=a-long-random-secret
CLIENT_URL=https://your-app.vercel.app
ADMIN_NAME=Sumptuous Braids Admin
ADMIN_EMAIL=admin@sumptuousbraids.com
ADMIN_PASSWORD=choose-a-strong-password
NODE_ENV=production
VITE_API_URL=/api
VITE_WHATSAPP_NUMBER=2348070453422
VITE_CLOUDINARY_CLOUD_NAME=aza7bayf
VITE_CLOUDINARY_UPLOAD_PRESET=Spuntous braids
```

In Cloudinary, the preset must be **Unsigned**.

## Local setup

```bash
cd server
cp .env.example .env
npm install --include=dev
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

```bash
cd client
cp .env.example .env
npm install --include=dev
npm run dev
```

Default admin: `admin@sumptuousbraids.com` / `ChangeMe123!`
