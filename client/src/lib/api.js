import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

const normalizeApiUrl = (url) => {
  const cleanUrl = String(url).replace(/\/+$/, '');
  return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
};

export const API_URL = normalizeApiUrl(rawApiUrl);

export const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sb_admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
      localStorage.removeItem('sb_admin_token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  },
);

export const formatNaira = (value) => new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  maximumFractionDigits: 0,
}).format(Number(value || 0));

export const cloudinaryCloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'aza7bayf';
export const cloudinaryUploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'Spuntous braids';

export async function uploadUnsignedImage(file, folder = 'sumptuous-braids') {
  const body = new FormData();
  body.append('file', file);
  body.append('upload_preset', cloudinaryUploadPreset);
  if (folder) body.append('folder', folder);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`, {
    method: 'POST',
    body,
  });
  const data = await res.json();
  if (!res.ok || !data.secure_url) {
    throw new Error(data.error?.message || 'Unsigned Cloudinary upload failed. Confirm the preset is set to Unsigned.');
  }
  return data;
}

export const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '2348070453422';

export const logoUrl = '/logo.png';

export const bankDetails = {
  bankName: 'Confirm on WhatsApp',
  accountNumber: 'Request account details',
  accountName: 'Sumptuous Braids',
};

export const deliveryOptions = [
  { value: 'PICKUP', label: 'Pickup from studio', fee: 0, note: 'Pick up from Sumptuous Braids at 86 Wethral Road, opposite Premium Trust Bank, after confirmation.' },
  { value: 'OWERRI_DELIVERY', label: 'Owerri delivery', fee: 3000, note: 'Delivery within Owerri. Rider delivery will be coordinated after order confirmation.' },
  { value: 'WAYBILL_PARK', label: 'Waybill / park dispatch', fee: 1000, note: 'Covers sending your order to the park. Transport may contact you for remaining delivery cost based on destination.' },
  { value: 'OTHER_STATES_DISPATCH', label: 'Other states dispatch', fee: 0, note: 'Dispatch to other cities is coordinated after confirmation based on destination and courier options.' },
];

export const businessInfo = {
  name: 'Sumptuous Braids',
  brand: 'Sumptuous Braids',
  email: 'Johnassumpta3@gmail.com',
  phoneDisplay: '0807 045 3422',
  callLine: '08070453422',
  instagram: '@sumptuousbraids',
  tiktok: '@sumptuousbraids',
  facebook: 'Sumptuous Braids',
  instagramUrl: 'https://www.instagram.com/sumptuousbraids',
  tiktokUrl: 'https://www.tiktok.com/@sumptuousbraids',
  facebookUrl: 'https://www.facebook.com/share/14msRH6cJ4t/',
  location: '86 Wethral Road, opposite Premium Trust Bank, Owerri, Imo State, Nigeria',
  addressShort: '86 Wethral Road, opposite Premium Trust Bank',
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=86%20Wethral%20Road%20opposite%20Premium%20Trust%20Bank%20Owerri',
};
