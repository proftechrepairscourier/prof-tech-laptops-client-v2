import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config.js';

export default function FilterPanel({ filters, setFilters }) {
  const [options, setOptions] = useState(null);

  useEffect(() => {
    axios.get(`${API_URL}/laptops/filters`).then((r) => setOptions(r.data)).catch(() => {});
  }, []);

  const set = (key, val) => setFilters((f) => ({ ...f, [key]: val || '' }));
  const reset = () =>
    setFilters({
      search: '', category: '', brand: '', minPrice: '', maxPrice: '',
      ram: '', storage: '', generation: '', gpu: '', condition: '', sort: 'newest',
    });

  const Select = ({ label, value, onChange, options: opts }) => (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-slate-600">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
      >
        <option value="">All</option>
        {opts.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900">Filters</h3>
        <button onClick={reset} className="text-xs font-semibold text-brand-600 hover:text-brand-700">
          Reset
        </button>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Select
          label="Brand"
          value={filters.brand}
          onChange={(v) => set('brand', v)}
          options={options?.brands || []}
        />
        <Select
          label="Generation"
          value={filters.generation}
          onChange={(v) => set('generation', v)}
          options={options?.generations || []}
        />
        <Select
          label="Condition"
          value={filters.condition}
          onChange={(v) => set('condition', v)}
          options={options?.conditions || []}
        />
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-slate-600">RAM</span>
          <input
            value={filters.ram}
            onChange={(e) => set('ram', e.target.value)}
            placeholder="e.g. 16GB"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-slate-600">Storage</span>
          <input
            value={filters.storage}
            onChange={(e) => set('storage', e.target.value)}
            placeholder="e.g. 512GB"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-slate-600">GPU</span>
          <input
            value={filters.gpu}
            onChange={(e) => set('gpu', e.target.value)}
            placeholder="e.g. GTX"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-slate-600">Min Price</span>
          <input
            type="number"
            value={filters.minPrice}
            onChange={(e) => set('minPrice', e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-slate-600">Max Price</span>
          <input
            type="number"
            value={filters.maxPrice}
            onChange={(e) => set('maxPrice', e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
        </label>
        <Select
          label="Sort"
          value={filters.sort}
          onChange={(v) => set('sort', v)}
          options={[
            { value: 'newest', label: 'Newest' },
            { value: 'price_asc', label: 'Price: Low → High' },
            { value: 'price_desc', label: 'Price: High → Low' },
          ].map(o => o.value)}
        />
      </div>
    </div>
  );
}