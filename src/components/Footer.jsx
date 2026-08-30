import { Link } from 'react-router-dom';
import { BRAND_NAME, TAGLINE, WHATSAPP_NUMBER } from '../config.js';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white font-bold">P</div>
              <span className="text-lg font-extrabold">{BRAND_NAME}</span>
            </div>
            <p className="mt-3 text-sm text-slate-600">{TAGLINE}</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900">Categories</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li><Link to="/category/students" className="hover:text-slate-900">Students</Link></li>
              <li><Link to="/category/office" className="hover:text-slate-900">Office Work</Link></li>
              <li><Link to="/category/gaming" className="hover:text-slate-900">Gaming</Link></li>
              <li><Link to="/category/engineering" className="hover:text-slate-900">Engineering</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900">Contact</h4>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-green-600 hover:text-green-700"
            >
              WhatsApp: 0{WHATSAPP_NUMBER.replace('254', '')}
            </a>
          </div>
        </div>
        <div className="mt-10 border-t border-slate-200 pt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}