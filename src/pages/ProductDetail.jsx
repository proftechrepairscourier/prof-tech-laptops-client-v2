import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config.js';
import SEOHead from '../components/SEOHead.jsx';
import WhatsAppButton from '../components/WhatsAppButton.jsx';
import ShareButton from '../components/ShareButton.jsx';
import StockBadge from '../components/StockBadge.jsx';
import MpesaInfo from '../components/MpesaInfo.jsx';

const formatPrice = (n) => `KSh ${Number(n).toLocaleString('en-KE')}`;

export default function ProductDetail() {
  const { slug } = useParams();
  const [laptop, setLaptop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImg, setMainImg] = useState(0);

  useEffect(() => {
    setLoading(true);
    setMainImg(0);
    axios.get(`${API_URL}/laptops/${slug}`)
      .then((r) => setLaptop(r.data.laptop))
      .catch(() => setLaptop(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="h-80 animate-pulse rounded-2xl bg-slate-100" />
      </main>
    );
  }
  if (!laptop) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Laptop not found</h1>
        <Link to="/laptops" className="mt-4 inline-block text-sm font-semibold text-brand-600">
          ← Back to all laptops
        </Link>
      </main>
    );
  }

  const specs = [
    ['Processor', laptop.processor],
    ['Generation', laptop.generation && `${laptop.generation} Gen`],
    ['RAM', laptop.ram],
    ['Storage', laptop.storage],
    ['Screen', laptop.screenSize],
    ['GPU', laptop.gpu],
    ['Operating System', laptop.operatingSystem],
    ['Condition', laptop.condition],
  ].filter(([, v]) => v);

  const isSoldOut = laptop.stockStatus === 'sold_out';
  const images = laptop.images || [];

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <SEOHead
        title={`${laptop.brand} ${laptop.model} — ${formatPrice(laptop.price)}`}
        description={`${laptop.brand} ${laptop.model}. ${laptop.processor || ''} ${laptop.ram || ''} ${laptop.storage || ''}. ${laptop.condition || ''}.`}
        image={images[0]?.url}
        url={`/laptops/${laptop.slug}`}
        type="product"
      />

      <nav className="mb-4 text-xs text-slate-500">
        <Link to="/" className="hover:text-slate-900">Home</Link> /{' '}
        <Link to="/laptops" className="hover:text-slate-900">All Laptops</Link> /{' '}
        <span className="text-slate-700">{laptop.brand} {laptop.model}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Images */}
        <div>
          <div className="aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
            {images[mainImg]?.url ? (
              <img
                src={images[mainImg].url}
                alt={`${laptop.brand} ${laptop.model}`}
                className="h-full w-full object-contain p-4"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-slate-300">No image</div>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
              {images.map((img, i) => (
                <button
                  key={img.publicId || i}
                  onClick={() => setMainImg(i)}
                  className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 bg-white ${
                    i === mainImg ? 'border-brand-500' : 'border-slate-200'
                  }`}
                >
                  <img src={img.url} alt="" className="h-full w-full object-contain p-1" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">{laptop.brand}</p>
          <h1 className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">
            {laptop.brand} {laptop.model}
          </h1>

          <div className="mt-3 flex items-center gap-3">
            <StockBadge status={laptop.stockStatus} />
            {laptop.featured && (
              <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 ring-1 ring-amber-200">
                Featured
              </span>
            )}
          </div>

          <p className="mt-4 text-3xl font-extrabold text-slate-900">{formatPrice(laptop.price)}</p>

          {specs.length > 0 && (
            <dl className="mt-6 divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white">
              {specs.map(([k, v]) => (
                <div key={k} className="flex justify-between px-4 py-3 text-sm">
                  <dt className="font-medium text-slate-500">{k}</dt>
                  <dd className="font-semibold text-slate-900">{v}</dd>
                </div>
              ))}
            </dl>
          )}

          {laptop.description && (
            <p className="mt-6 text-sm leading-relaxed text-slate-600">{laptop.description}</p>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {!isSoldOut ? (
              <WhatsAppButton laptop={laptop} className="flex-1" />
            ) : (
              <div className="flex-1 rounded-xl bg-slate-100 px-5 py-3 text-center text-sm font-semibold text-slate-500">
                This item is SOLD OUT
              </div>
            )}
            <ShareButton laptop={laptop} />
          </div>
        </div>
      </div>

      <section className="mt-16">
        <MpesaInfo />
      </section>
    </main>
  );
}