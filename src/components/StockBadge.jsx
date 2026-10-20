export default function StockBadge({ status }) {
  const map = {
    available: { label: 'Available', cls: 'bg-green-50 text-green-700 ring-green-200' },
    low_stock: { label: 'Low Stock', cls: 'bg-amber-50 text-amber-700 ring-amber-200' },
    sold_out: { label: 'Sold Out', cls: 'bg-slate-100 text-slate-500 ring-slate-200' },
  };
  const s = map[status] || map.available;
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ${s.cls}`}>
      {s.label}
    </span>
  );
}