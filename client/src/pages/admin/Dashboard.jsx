import { useEffect, useState } from 'react';
import { AlertTriangle, ArrowUpRight, Banknote, Boxes, Clock, PackageX, ReceiptText, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api, formatNaira } from '../../lib/api.js';

const StatCard = ({ label, value, Icon, tone = 'amber' }) => {
  const tones = {
    amber: 'bg-amber-100 text-amber-800',
    green: 'bg-green-100 text-green-800',
    blue: 'bg-blue-100 text-blue-800',
    red: 'bg-red-100 text-red-800',
    stone: 'bg-stone-100 text-stone-800',
  };

  return (
    <div className="rounded-[2rem] border border-amber-900/10 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <span className={`rounded-2xl p-3 ${tones[tone]}`}><Icon size={22} /></span>
        <ArrowUpRight size={18} className="text-stone-300" />
      </div>
      <p className="mt-5 text-sm text-stone-500">{label}</p>
      <strong className="mt-2 block text-2xl text-stone-950">{value}</strong>
    </div>
  );
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/orders/stats/summary')
      .then((res) => setStats(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Unable to load dashboard stats.'));
    api.get('/analytics/summary').then((res) => setAnalytics(res.data)).catch(() => null);
  }, []);

  return (
    <section className="p-6 lg:p-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-amber-700">Overview</p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-stone-950">Luxury Store Dashboard</h1>
          <p className="mt-2 text-stone-600">Monitor sales, pending orders, stock, and store setup from one place.</p>
        </div>
        <Link to="/admin/products" className="rounded-full bg-stone-950 px-6 py-3 font-semibold text-white hover:bg-amber-700">Add Product</Link>
      </div>

      {error && <div className="mt-6 flex items-center gap-3 rounded-2xl bg-red-50 p-4 text-red-700"><AlertTriangle size={18} /> {error}</div>}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total Sales" value={formatNaira(stats?.totalSales || 0)} Icon={Banknote} tone="green" />
        <StatCard label="Total Orders" value={stats?.totalOrders || 0} Icon={ReceiptText} tone="blue" />
        <StatCard label="Pending Orders" value={stats?.pendingOrders || 0} Icon={Clock} tone="amber" />
        <StatCard label="Products" value={stats?.totalProducts || 0} Icon={Boxes} tone="stone" />
        <StatCard label="Out of Stock" value={stats?.outOfStockProducts || 0} Icon={PackageX} tone="red" />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Visits Today" value={analytics?.todayVisits || 0} Icon={Sparkles} tone="amber" />
        <StatCard label="30-Day Visits" value={analytics?.thirtyDayVisits || 0} Icon={ReceiptText} tone="blue" />
        <StatCard label="Unique Visitors" value={analytics?.uniqueVisitors30d || 0} Icon={Boxes} tone="green" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-[2.5rem] bg-stone-950 p-8 text-white shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-stone-950"><Sparkles /></div>
          <h2 className="mt-5 font-display text-3xl">Today’s Admin Flow</h2>
          <div className="mt-6 grid gap-3 text-sm text-stone-300">
            <p>1. Add or update products with clear images and correct prices.</p>
            <p>2. Check new customer orders and contact them through WhatsApp.</p>
            <p>3. Update order status from Pending to Delivered.</p>
            <p>4. Use coupons for promos like ROC10.</p>
          </div>
        </div>
        <div className="rounded-[2.5rem] border border-amber-900/10 bg-white p-8 shadow-sm">
          <h2 className="font-display text-3xl">Quick Actions</h2>
          <div className="mt-6 grid gap-3">
            <Link to="/admin/products" className="rounded-2xl bg-amber-50 px-5 py-4 font-semibold text-amber-900 hover:bg-amber-100">Manage Products</Link>
            <Link to="/admin/orders" className="rounded-2xl bg-stone-100 px-5 py-4 font-semibold text-stone-900 hover:bg-stone-200">View Orders</Link>
            <Link to="/admin/analytics" className="rounded-2xl bg-stone-100 px-5 py-4 font-semibold text-stone-900 hover:bg-stone-200">View Website Analytics</Link>
            <Link to="/admin/testimonials" className="rounded-2xl bg-stone-100 px-5 py-4 font-semibold text-stone-900 hover:bg-stone-200">Manage Testimonials</Link>
            <Link to="/admin/settings" className="rounded-2xl bg-stone-100 px-5 py-4 font-semibold text-stone-900 hover:bg-stone-200">Categories & Coupons</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
