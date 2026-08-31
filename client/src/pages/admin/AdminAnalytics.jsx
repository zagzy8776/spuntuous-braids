import { useEffect, useState } from 'react';
import { Activity, BarChart3, Eye, MonitorSmartphone, MousePointerClick, Users } from 'lucide-react';
import { api } from '../../lib/api.js';

const Card = ({ label, value, Icon }) => <div className="rounded-[2rem] bg-white p-6 shadow-sm"><Icon className="text-amber-700" /><p className="mt-4 text-sm text-stone-500">{label}</p><strong className="text-2xl">{value}</strong></div>;

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/analytics/summary').then((res) => setData(res.data)).catch((err) => setError(err.response?.data?.message || 'Unable to load analytics.'));
  }, []);

  return (
    <section className="p-6 lg:p-10">
      <div>
        <p className="text-sm uppercase tracking-[0.28em] text-amber-700">Visitor Intelligence</p>
        <h1 className="mt-2 font-display text-4xl font-semibold">Website Analytics</h1>
        <p className="mt-2 text-stone-600">See how people discover and use Sumptuous Braids.</p>
      </div>
      {error && <p className="mt-6 rounded-2xl bg-red-50 p-4 text-red-700">{error}</p>}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card label="Visits Today" value={data?.todayVisits || 0} Icon={Eye} />
        <Card label="7-Day Visits" value={data?.sevenDayVisits || 0} Icon={Activity} />
        <Card label="30-Day Visits" value={data?.thirtyDayVisits || 0} Icon={BarChart3} />
        <Card label="Unique Visitors 30d" value={data?.uniqueVisitors30d || 0} Icon={Users} />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <Panel title="Popular Pages" icon={MousePointerClick} items={data?.popularPages?.map((item) => [item.path, item.visits])} />
        <Panel title="Product Views" icon={Eye} items={data?.popularProducts?.map((item) => [item.slug, item.views])} />
        <Panel title="Traffic Sources" icon={BarChart3} items={data?.topSources?.map((item) => [item.source, item.visits])} />
        <Panel title="Devices" icon={MonitorSmartphone} items={data?.deviceBreakdown?.map((item) => [item.device, item.visits])} />
      </div>

      <div className="mt-8 rounded-[2rem] bg-white p-6 shadow-sm">
        <h2 className="font-display text-2xl">Recent Visits</h2>
        <div className="mt-4 grid gap-3">
          {data?.recentVisits?.map((visit) => <div key={visit.id} className="flex flex-wrap justify-between gap-3 rounded-2xl bg-stone-50 p-4 text-sm"><span>{visit.path}</span><span className="text-stone-500">{visit.source || 'Direct'} · {visit.device || 'Unknown'} · {new Date(visit.createdAt).toLocaleString()}</span></div>)}
        </div>
      </div>
    </section>
  );
}

function Panel({ title, icon: Icon, items = [] }) {
  return <div className="rounded-[2rem] bg-white p-6 shadow-sm"><div className="flex items-center gap-2"><Icon className="text-amber-700" /><h2 className="font-display text-2xl">{title}</h2></div><div className="mt-5 grid gap-3">{items?.length ? items.map(([label, value]) => <div key={label} className="flex justify-between rounded-2xl bg-stone-50 p-3"><span className="truncate">{label || 'Unknown'}</span><strong>{value}</strong></div>) : <p className="text-sm text-stone-500">No data yet.</p>}</div></div>;
}