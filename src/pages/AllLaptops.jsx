import { useSearchParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import SEOHead from '../components/SEOHead.jsx';
import SearchBar from '../components/SearchBar.jsx';
import FilterPanel from '../components/FilterPanel.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { useLaptops } from '../hooks/useLaptops.js';

export default function AllLaptops() {
  const [params, setParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const filters = useMemo(() => ({
    search: params.get('search') || '',
    category: params.get('category') || '',
    brand: params.get('brand') || '',
    minPrice: params.get('minPrice') || '',
    maxPrice: params.get('maxPrice') || '',
    ram: params.get('ram') || '',
    storage: params.get('storage') || '',
    generation: params.get('generation') || '',
    gpu: params.get('gpu') || '',
    condition: params.get('condition') || '',
    sort: params.get('sort') || 'newest',
    page: params.get('page') || '1',
    limit: '12',
  }), [params]);

  const { laptops, pagination, loading } = useLaptops(filters);

  const setFilters = (next) => {
    const p = new URLSearchParams();
    Object.entries(next).forEach(([k, v]) => {
      if (v !== '' && v !== null && v !== undefined) p.set(k, v);
    });
    setParams(p, { replace: true });
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <SEOHead title="All Laptops" description="Browse all available laptops at PROF TECH." url="/laptops" />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-900">All Laptops</h1>
        <button
          onClick={() => setShowFilters((v) => !v)}
          className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 sm:self-auto"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M6 12h12M10 18h4" strokeLinecap="round" />
          </svg>
          {showFilters ? 'Hide filters' : 'Show filters'}
        </button>
      </div>

      <div className="mt-4">
        <SearchBar
          initial={filters.search}
          onSearch={(q) => setFilters({ ...filters, search: q, page: '1' })}
        />
      </div>

      {showFilters && (
        <div className="mt-4">
          <FilterPanel filters={filters} setFilters={(f) => setFilters({ ...f, page: '1' })} />
        </div>
      )}

      {loading ? (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-72 animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
      ) : laptops.length === 0 ? (
        <p className="mt-8 text-center text-sm text-slate-500">No laptops match your filters.</p>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {laptops.map((l) => <ProductCard key={l._id} laptop={l} />)}
          </div>

          {pagination && pagination.pages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() => setFilters({ ...filters, page: String(pagination.page - 1) })}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-sm text-slate-600">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                disabled={pagination.page >= pagination.pages}
                onClick={() => setFilters({ ...filters, page: String(pagination.page + 1) })}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}