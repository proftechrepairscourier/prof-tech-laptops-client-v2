import { useState } from 'react';

export default function SearchBar({ initial = '', onSearch }) {
  const [value, setValue] = useState(initial);
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSearch(value); }}
      className="flex w-full items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search by brand, model, processor, generation..."
        className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
      />
      {value && (
        <button
          type="button"
          onClick={() => { setValue(''); onSearch(''); }}
          className="text-xs text-slate-500 hover:text-slate-900"
        >
          Clear
        </button>
      )}
    </form>
  );
}