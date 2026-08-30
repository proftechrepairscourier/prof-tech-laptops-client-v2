import { WHATSAPP_NUMBER } from '../config.js';

const formatPrice = (n) => `KSh ${Number(n).toLocaleString('en-KE')}`;

export default function WhatsAppButton({ laptop, className = '', children }) {
  const text = encodeURIComponent(
    `Hello PROF TECH, I am interested in the ${laptop.brand} ${laptop.model} listed at ${formatPrice(laptop.price)}. Is it still available?`
  );
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-5 py-3 text-sm font-semibold text-white hover:bg-green-600 ${className}`}
    >
      {children || (
        <>
          <WhatsAppIcon /> Chat on WhatsApp
        </>
      )}
    </a>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.52 3.48A11.93 11.93 0 0012.04 0C5.5 0 .2 5.3.2 11.84c0 2.09.55 4.13 1.6 5.93L0 24l6.4-1.68a11.82 11.82 0 005.64 1.44h.01c6.54 0 11.84-5.3 11.84-11.84 0-3.16-1.23-6.13-3.37-8.44z" />
    </svg>
  );
}