import { SITE_URL } from '../config.js';

export default function ShareButton({ laptop }) {
  const url = `${SITE_URL}/laptops/${laptop.slug}`;
  const text = `Check out this ${laptop.brand} ${laptop.model} on PROF TECH — KSh ${Number(laptop.price).toLocaleString('en-KE')}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: `${laptop.brand} ${laptop.model}`, text, url });
        return;
      } catch {}
    }
    // Fallback: WhatsApp share
    const wa = `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`;
    window.open(wa, '_blank');
  };

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
      </svg>
      Share
    </button>
  );
}