import axios from 'axios';

export const business = {
  name: 'Sumptuous Braids',
  email: 'Johnassumpta3@gmail.com',
  phone: '08070453422',
  whatsapp: '2348070453422',
  address: '86 Wethral Road, opposite Premium Trust Bank, Owerri',
  tiktok: 'https://www.tiktok.com/@sumptuousbraids',
  instagram: 'https://www.instagram.com/sumptuousbraids',
  facebook: 'https://www.facebook.com/share/14msRH6cJ4t/',
};

export const whatsappUrl = (message = 'Hello Sumptuous Braids, I would like to make an enquiry.') => `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(message)}`;
export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });
