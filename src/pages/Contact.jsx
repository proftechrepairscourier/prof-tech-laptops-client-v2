import { BRAND_NAME, WHATSAPP_NUMBER } from '../config.js';
import SEOHead from '../components/SEOHead.jsx';
import MpesaInfo from '../components/MpesaInfo.jsx';

export default function Contact() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <SEOHead title="Contact" description="Contact PROF TECH on WhatsApp." url="/contact" />
      <h1 className="text-2xl font-bold text-slate-900">Contact {BRAND_NAME}</h1>
      <p className="mt-2 text-sm text-slate-500">
        The fastest way to reach us is via WhatsApp. We usually reply within minutes.
      </p>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
        <p className="text-sm font-semibold text-slate-700">WhatsApp</p>
        <p className="mt-1 text-2xl font-extrabold text-slate-900">0{WHATSAPP_NUMBER.replace('254', '')}</p>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-green-500 px-5 py-3 text-sm font-semibold text-white hover:bg-green-600"
        >
          CHAT ON WHATSAPP
        </a>
      </div>

      <div className="mt-6">
        <MpesaInfo />
      </div>
    </main>
  );
}