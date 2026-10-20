import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URL } from '../../config.js';

const CATEGORIES = [
  { value: 'students', label: 'Students' },
  { value: 'office', label: 'Office Work' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'engineering', label: 'Engineering' },
];

const STOCK = [
  { value: 'available', label: 'Available' },
  { value: 'low_stock', label: 'Low Stock' },
  { value: 'sold_out', label: 'Sold Out' },
];

const empty = {
  brand: '', model: '', categories: [], processor: '', generation: '',
  ram: '', storage: '', screenSize: '', gpu: '', operatingSystem: '',
  condition: '', price: '', description: '', stockStatus: 'available',
  featured: false, images: [],
};

export default function LaptopForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(empty);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit) {
      axios.get(`${API_URL}/laptops/admin/all`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('pt_token')}` },
      }).then(({ data }) => {
        const l = data.laptops.find((x) => x._id === id);
        if (l) {
          setForm({
            brand: l.brand || '', model: l.model || '',
            categories: l.categories || [], processor: l.processor || '',
            generation: l.generation || '', ram: l.ram || '',
            storage: l.storage || '', screenSize: l.screenSize || '',
            gpu: l.gpu || '', operatingSystem: l.operatingSystem || '',
            condition: l.condition || '', price: l.price ?? '',
            description: l.description || '', stockStatus: l.stockStatus || 'available',
            featured: !!l.featured, images: l.images || [],
          });
        }
      });
    }
  }, [id, isEdit]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const toggleCategory = (c) =>
    setForm((f) => ({
      ...f,
      categories: f.categories.includes(c)
        ? f.categories.filter((x) => x !== c)
        : [...f.categories, c],
    }));

  const uploadImages = async (files) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const fd = new FormData();
      Array.from(files).forEach((f) => fd.append('images', f));
      const { data } = await axios.post(`${API_URL}/upload/images`, fd, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('pt_token')}`,
        },
      });
      setForm((f) => ({ ...f, images: [...f.images, ...data.images] }));
      toast.success('Images uploaded');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async (publicId, idx) => {
    try {
      if (publicId) {
        await axios.post(`${API_URL}/upload/images/delete`, { publicId }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('pt_token')}` },
        });
      }
      setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
    } catch {
      toast.error('Could not remove image');
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.brand || !form.model || !form.price) {
      toast.error('Brand, model and price are required');
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price) };
      const headers = { Authorization: `Bearer ${localStorage.getItem('pt_token')}` };
      if (isEdit) {
        await axios.put(`${API_URL}/laptops/${id}`, payload, { headers });
        toast.success('Laptop updated');
      } else {
        await axios.post(`${API_URL}/laptops`, payload, { headers });
        toast.success('Laptop added');
      }
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <Link to="/admin" className="text-sm font-semibold text-slate-700">← Back</Link>
          <h1 className="text-sm font-bold text-slate-900">{isEdit ? 'Edit Laptop' : 'Add Laptop'}</h1>
          <div className="w-12" />
        </div>
      </header>

      <form onSubmit={submit} className="mx-auto max-w-4xl px-4 py-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Brand *"><input value={form.brand} onChange={(e) => set('brand', e.target.value)} className={inputCls} required /></Field>
            <Field label="Model *"><input value={form.model} onChange={(e) => set('model', e.target.value)} className={inputCls} required /></Field>
            <Field label="Price (KSh) *"><input type="number" value={form.price} onChange={(e) => set('price', e.target.value)} className={inputCls} required /></Field>
            <Field label="Condition"><input value={form.condition} onChange={(e) => set('condition', e.target.value)} placeholder="Ex-UK / Refurbished" className={inputCls} /></Field>
            <Field label="Processor"><input value={form.processor} onChange={(e) => set('processor', e.target.value)} placeholder="Intel Core i5" className={inputCls} /></Field>
            <Field label="Generation"><input value={form.generation} onChange={(e) => set('generation', e.target.value)} placeholder="11" className={inputCls} /></Field>
            <Field label="RAM"><input value={form.ram} onChange={(e) => set('ram', e.target.value)} placeholder="16GB" className={inputCls} /></Field>
            <Field label="Storage"><input value={form.storage} onChange={(e) => set('storage', e.target.value)} placeholder="512GB SSD" className={inputCls} /></Field>
            <Field label="Screen size"><input value={form.screenSize} onChange={(e) => set('screenSize', e.target.value)} placeholder='14"' className={inputCls} /></Field>
            <Field label="GPU"><input value={form.gpu} onChange={(e) => set('gpu', e.target.value)} placeholder="Intel Iris Xe" className={inputCls} /></Field>
            <Field label="Operating System"><input value={form.operatingSystem} onChange={(e) => set('operatingSystem', e.target.value)} placeholder="Windows 11" className={inputCls} /></Field>
            <Field label="Stock status">
              <select value={form.stockStatus} onChange={(e) => set('stockStatus', e.target.value)} className={inputCls}>
                {STOCK.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </Field>
          </div>

          <div className="mt-4">
            <span className="mb-2 block text-xs font-semibold text-slate-600">Categories</span>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => {
                const active = form.categories.includes(c.value);
                return (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => toggleCategory(c.value)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${
                      active
                        ? 'bg-slate-900 text-white ring-slate-900'
                        : 'bg-white text-slate-700 ring-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4">
            <Field label="Description">
              <textarea
                rows="3"
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                className={inputCls}
              />
            </Field>
          </div>

          <label className="mt-4 flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => set('featured', e.target.checked)}
              className="h-4 w-4 rounded border-slate-300"
            />
            Mark as Featured
          </label>
        </div>

        {/* IMAGES */}
        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-bold text-slate-900">Images</h2>
          <p className="mt-1 text-xs text-slate-500">First image will be the cover. Upload multiple.</p>

          <label className="mt-3 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => uploadImages(e.target.files)}
              className="hidden"
            />
            <span className="text-sm font-semibold text-slate-700">
              {uploading ? 'Uploading…' : 'Click to upload images'}
            </span>
            <span className="mt-1 text-xs text-slate-500">PNG, JPG up to 5MB each</span>
          </label>

          {form.images.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5">
              {form.images.map((img, i) => (
                <div key={img.publicId || i} className="group relative aspect-square overflow-hidden rounded-lg bg-slate-100">
                  <img src={img.url} alt="" className="h-full w-full object-contain p-1" />
                  <button
                    type="button"
                    onClick={() => removeImage(img.publicId, i)}
                    className="absolute right-1 top-1 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white opacity-0 group-hover:opacity-100"
                  >
                    ✕
                  </button>
                  {i === 0 && (
                    <span className="absolute left-1 bottom-1 rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-semibold text-white">
                      Cover
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <Link to="/admin" className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Add laptop'}
          </button>
        </div>
      </form>
    </div>
  );
}

const inputCls =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100';

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-slate-600">{label}</span>
      {children}
    </label>
  );
}