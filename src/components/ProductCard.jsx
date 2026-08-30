import { Link } from 'react-router-dom';
import { WHATSAPP_NUMBER } from '../config.js';
import StockBadge from './StockBadge.jsx';

const formatPrice = (n) => `KSh ${Number(n).toLocaleString('en-KE')}`;

export default function ProductCard({ laptop }) {
  const {
    slug, brand, model, processor, generation, ram, storage,
    screenSize, gpu, operatingSystem, condition, price, images,
    stockStatus,
  } = laptop;

  const mainImage = images?.[0]?.url || '';
  const shortSpecs = [
    processor && `${processor}${generation ? ` ${generation} Gen` : ''}`,
    ram,
    storage,
    screenSize,
  ].filter(Boolean).join(' • ');

  const waText = encodeURIComponent(
    `Hello PROF TECH, I am interested in the ${brand} ${model} listed at ${formatPrice(price)}. Is it still available?`
  );
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`;
  const isSoldOut = stockStatus === 'sold_out';

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:border-slate-300 hover:shadow-sm">
      <Link to={`/laptops/${slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-slate-50">
          {mainImage ? (
            <img
              src={mainImage}
              alt={`${brand} ${model}`}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-contain p-4 transition group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-300">
              No image
            </div>
          )}
          <div className="absolute left-3 top-3">
            <StockBadge status={stockStatus} />
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">{brand}</p>
        <Link to={`/laptops/${slug}`}>
          <h3 className="mt-1 text-base font-bold text-slate-900 line-clamp-2">
            {brand} {model}
          </h3>
        </Link>

        {shortSpecs && (
          <p className="mt-2 text-xs text-slate-500 line-clamp-2">{shortSpecs}</p>
        )}

        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-extrabold text-slate-900">{formatPrice(price)}</span>
          {condition && (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
              {condition}
            </span>
          )}
        </div>

        {!isSoldOut ? (
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-600"
          >
            <WhatsAppIcon /> WhatsApp to Order
          </a>
        ) : (
          <div className="mt-4 rounded-xl bg-slate-100 px-4 py-2.5 text-center text-sm font-semibold text-slate-500">
            SOLD OUT
          </div>
        )}
      </div>
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.52 3.48A11.93 11.93 0 0012.04 0C5.5 0 .2 5.3.2 11.84c0 2.09.55 4.13 1.6 5.93L0 24l6.4-1.68a11.82 11.82 0 005.64 1.44h.01c6.54 0 11.84-5.3 11.84-11.84 0-3.16-1.23-6.13-3.37-8.44z" />
    </svg>
  );
}