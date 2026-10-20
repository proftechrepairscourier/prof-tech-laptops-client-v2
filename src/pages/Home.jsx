import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL, BRAND_NAME, TAGLINE, WHATSAPP_NUMBER } from '../config.js';
import SEOHead from '../components/SEOHead.jsx';
import SearchBar from '../components/SearchBar.jsx';
import ProductCard from '../components/ProductCard.jsx';
import MpesaInfo from '../components/MpesaInfo.jsx';

export default function Home() {
  const [latest, setLatest] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_URL}/laptops/latest?limit=8`)
      .then((r) => setLatest(r.data.laptops))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    { key: 'students',    emoji: '🎓', title: 'Students',      desc: 'Affordable laptops for school, college and university.' },
    { key: 'office',      emoji: '💼', title: 'Office Work',   desc: 'Reliable laptops for business and professional work.' },
    { key: 'gaming',      emoji: '🎮', title: 'Gaming',        desc: 'Laptops designed for gaming and high-performance apps.' },
    { key: 'engineering', emoji: '⚙️', title: 'Engineering',   desc: 'Laptops for CAD, SolidWorks, MATLAB and demanding work.' },
  ];

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <SEOHead />

      {/* HERO */}
      <section className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          {BRAND_NAME}
        </h1>
        <p className="mt-2 text-lg font-medium text-slate-700">{TAGLINE}</p>
        <p className="mx-auto mt-3 max-w-xl text-sm text-slate-500">
          Browse our latest laptops for students, professionals, gamers and engineers.
        </p>

        <div className="mx-auto mt-6 max-w-xl">
          <SearchBar onSearch={(q) => navigate(`/laptops?search=${encodeURIComponent(q)}`)} />
        </div>
      </section>

      {/* LATEST STOCK */}
      <section className="mt-12">
        <div className="flex items-end justify-between">
          <h2 className="text-xl font-bold text-slate-900">🔥 Latest Stock</h2>
          <Link to="/laptops" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-72 animate-pulse rounded-2xl bg-slate-100" />
            ))}
          </div>
        ) : latest.length === 0 ? (
          <p className="mt-6 text-sm text-slate-500">No laptops available right now. Check back soon.</p>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {latest.map((l) => <ProductCard key={l._id} laptop={l} />)}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            to="/laptops"
            className="inline-flex rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            VIEW ALL LAPTOPS
          </Link>
        </div>
      </section>

      {/* SHOP BY USE */}
      <section className="mt-16">
        <h2 className="text-xl font-bold text-slate-900">Shop by Use</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.key}
              to={`/category/${c.key}`}
              className="group rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-sm"
            >
              <div className="text-3xl">{c.emoji}</div>
              <h3 className="mt-2 text-base font-bold text-slate-900">{c.title}</h3>
              <p className="mt-1 text-xs text-slate-500 line-clamp-3">{c.desc}</p>
              <span className="mt-3 inline-block text-xs font-semibold text-brand-600 group-hover:text-brand-700">
                Browse →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* WHY PROF TECH */}
      <section className="mt-16">
        <h2 className="text-xl font-bold text-slate-900">Why PROF TECH?</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            '✓ Quality checked laptops',
            '✓ Competitive prices',
            '✓ WhatsApp ordering',
            '✓ Convenient LOOP payment',
          ].map((t) => (
            <li key={t} className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
              {t}
            </li>
          ))}
        </ul>
      </section>

      {/* MPESA */}
      <section className="mt-16">
        <MpesaInfo />
      </section>

      {/* CONTACT */}
      <section className="mt-16 text-center">
        <h2 className="text-xl font-bold text-slate-900">Contact PROF TECH</h2>
        <p className="mt-2 text-sm text-slate-500">WhatsApp: 0{WHATSAPP_NUMBER.replace('254', '')}</p>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-green-500 px-6 py-3 text-sm font-semibold text-white hover:bg-green-600"
        >
          CHAT ON WHATSAPP
        </a>
      </section>
    </main>
  );
}