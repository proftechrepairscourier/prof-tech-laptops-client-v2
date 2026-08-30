import { useParams, Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { useLaptops } from '../hooks/useLaptops.js';

const META = {
  students:    { title: 'Laptops for Students',     emoji: '🎓', desc: 'Affordable laptops for school, college and university.' },
  office:      { title: 'Laptops for Office Work',  emoji: '💼', desc: 'Reliable laptops for business and professional work.' },
  gaming:      { title: 'Gaming Laptops',           emoji: '🎮', desc: 'High-performance laptops for gaming and demanding apps.' },
  engineering: { title: 'Laptops for Engineering',  emoji: '⚙️', desc: 'Laptops for CAD, SolidWorks, MATLAB and engineering work.' },
};

export default function CategoryPage() {
  const { category } = useParams();
  const meta = META[category] || META.students;
  const { laptops, loading } = useLaptops({ category, limit: '40' });

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <SEOHead title={meta.title} description={meta.desc} url={`/category/${category}`} />

      <nav className="mb-4 text-xs text-slate-500">
        <Link to="/" className="hover:text-slate-900">Home</Link> /{' '}
        <span className="text-slate-700">{meta.title}</span>
      </nav>

      <div className="flex items-center gap-3">
        <span className="text-3xl">{meta.emoji}</span>
        <h1 className="text-2xl font-bold text-slate-900">{meta.title}</h1>
      </div>
      <p className="mt-2 text-sm text-slate-500">{meta.desc}</p>

      {loading ? (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-72 animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
      ) : laptops.length === 0 ? (
        <p className="mt-8 text-sm text-slate-500">No laptops in this category right now.</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {laptops.map((l) => <ProductCard key={l._id} laptop={l} />)}
        </div>
      )}
    </main>
  );
}