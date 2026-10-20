import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URL } from '../../config.js';
import { useAuth } from '../../context/AuthContext.jsx';

const formatPrice = (n) => `KSh ${Number(n).toLocaleString('en-KE')}`;

export default function Dashboard() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [laptops, setLaptops] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/laptops/admin/all`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('pt_token')}` },
      });
      setLaptops(data.laptops);
    } catch {
      toast.error('Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const update = async (id, patch) => {
    try {
      await axios.put(`${API_URL}/laptops/${id}`, patch, {
        headers: { Authorization: `Bearer ${localStorage.getItem('pt_token')}` },
      });
      toast.success('Updated');
      load();
    } catch {
      toast.error('Update failed');
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this laptop? This cannot be undone.')) return;
    try {
      await axios.delete(`${API_URL}/laptops/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('pt_token')}` },
      });
      toast.success('Deleted');
      load();
    } catch {
      toast.error('Delete failed');
    }
  };

  const stats = {
    total: laptops.length,
    available: laptops.filter((l) => l.stockStatus === 'available').length,
    low: laptops.filter((l) => l.stockStatus === 'low_stock').length,
    sold: laptops.filter((l) => l.stockStatus === 'sold_out').length,
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white font-bold">P</div>
            <div>
              <p className="text-sm font-bold text-slate-900">PROF TECH Admin</p>
              <p className="text-xs text-slate-500">{admin?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" className="text-xs font-semibold text-slate-600 hover:text-slate-900">View site</Link>
            <button
              onClick={() => { logout(); navigate('/admin/login'); }}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
          <Link
            to="/admin/new"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            + Add Laptop
          </Link>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Total" value={stats.total} />
          <StatCard label="Available" value={stats.available} tone="green" />
          <StatCard label="Low Stock" value={stats.low} tone="amber" />
          <StatCard label="Sold Out" value={stats.sold} tone="slate" />
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {loading ? (
            <div className="p-6 text-center text-sm text-slate-500">Loading…</div>
          ) : laptops.length === 0 ? (
            <div className="p-6 text-center text-sm text-slate-500">No laptops yet. Add your first one.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Image</th>
                    <th className="px-4 py-3">Model</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Stock</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {laptops.map((l) => (
                    <tr key={l._id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="h-12 w-12 overflow-hidden rounded-lg bg-slate-100">
                          {l.images?.[0]?.url && (
                            <img src={l.images[0].url} alt="" className="h-full w-full object-contain" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-900">{l.brand} {l.model}</p>
                        {l.featured && <span className="text-[10px] font-semibold text-amber-600">★ Featured</span>}
                      </td>
                      <td className="px-4 py-3 font-semibold">{formatPrice(l.price)}</td>
                      <td className="px-4 py-3 text-xs text-slate-500">{(l.categories || []).join(', ') || '—'}</td>
                      <td className="px-4 py-3">
                        <select
                          value={l.stockStatus}
                          onChange={(e) => update(l._id, { stockStatus: e.target.value })}
                          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs"
                        >
                          <option value="available">Available</option>
                          <option value="low_stock">Low Stock</option>
                          <option value="sold_out">Sold Out</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => update(l._id, { featured: !l.featured })}
                            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                            title="Toggle featured"
                          >
                            ★
                          </button>
                          <Link
                            to={`/admin/edit/${l._id}`}
                            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => remove(l._id)}
                            className="rounded-lg border border-red-200 bg-white px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, tone = 'slate' }) {
  const tones = {
    slate: 'bg-slate-50 text-slate-900',
    green: 'bg-green-50 text-green-700',
    amber: 'bg-amber-50 text-amber-700',
  };
  return (
    <div className={`rounded-2xl p-4 ${tones[tone]}`}>
      <p className="text-xs font-semibold uppercase tracking-wide opacity-70">{label}</p>
      <p className="mt-1 text-2xl font-extrabold">{value}</p>
    </div>
  );
}