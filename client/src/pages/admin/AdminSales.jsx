import { useEffect, useState } from 'react';
import { Banknote, BarChart3, ReceiptText, Users } from 'lucide-react';
import { api, formatNaira } from '../../lib/api.js';

const Card = ({ label, value, Icon }) => <div className="rounded-[2rem] bg-white p-6 shadow-sm"><Icon className="text-amber-700" /><p className="mt-4 text-sm text-stone-500">{label}</p><strong className="text-2xl">{value}</strong></div>;

export default function AdminSales() {
  const [stats, setStats] = useState(null);
  useEffect(() => { api.get('/orders/stats/summary').then((res) => setStats(res.data)).catch(() => null); }, []);
  return <section className="p-6 lg:p-10"><p className="text-sm uppercase tracking-[0.28em] text-amber-700">Sales Intelligence</p><h1 className="mt-2 font-display text-4xl font-semibold">Sales Analytics</h1>
    <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Card label="Revenue Today" value={formatNaira(stats?.revenueToday || 0)} Icon={Banknote} /><Card label="Revenue This Month" value={formatNaira(stats?.revenueThisMonth || 0)} Icon={BarChart3} /><Card label="Gross Profit" value={formatNaira(stats?.grossProfit || 0)} Icon={Banknote} /><Card label="Profit Margin" value={`${Number(stats?.profitMargin || 0).toFixed(1)}%`} Icon={ReceiptText} /></div>
    <div className="mt-8 grid gap-6 xl:grid-cols-2"><Panel title="Best Selling Products" items={stats?.bestSellingProducts?.map((item) => [`${item.productName} (${item.quantity})`, `${formatNaira(item.revenue)} / profit ${formatNaira(item.profit || 0)}`])} /><Panel title="Viewed But Not Sold" items={stats?.viewedNotSelling?.map((item) => [item.slug, `${item.views} views`])} /><Panel title="Revenue by Source" items={Object.entries(stats?.sourceRevenue || {}).map(([source, value]) => [source, formatNaira(value)])} /><Panel title="Repeat Customers" items={stats?.repeatCustomers?.map((item) => [`${item.name} (${item.orders} orders)`, formatNaira(item.totalSpent)])} /></div>
  </section>;
}

function Panel({ title, items = [] }) { return <div className="rounded-[2rem] bg-white p-6 shadow-sm"><h2 className="font-display text-2xl">{title}</h2><div className="mt-4 grid gap-3">{items?.length ? items.map(([a, b]) => <div key={`${a}-${b}`} className="flex justify-between gap-4 rounded-2xl bg-stone-50 p-3 text-sm"><span>{a}</span><strong>{b}</strong></div>) : <p className="text-sm text-stone-500">No data yet.</p>}</div></div>; }