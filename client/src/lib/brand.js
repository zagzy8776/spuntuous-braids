export const brand = {
  name: 'Sumptuous Braids',
  phone: '08070453422',
  whatsapp: '2348070453422',
  email: 'Johnassumpta3@gmail.com',
  address: '86 Wethral Road, opposite Premium Trust Bank, Owerri, Imo State, Nigeria',
  tiktok: 'https://www.tiktok.com/@sumptuousbraids',
  instagram: 'https://www.instagram.com/sumptuousbraids',
  facebook: 'https://www.facebook.com/share/14msRH6cJ4t/',
  map: 'https://www.google.com/maps/search/?api=1&query=86%20Wethral%20Road%20Owerri%20Imo%20State%20Nigeria',
};

export const whatsapp = (message = '') => `https://wa.me/${brand.whatsapp}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
