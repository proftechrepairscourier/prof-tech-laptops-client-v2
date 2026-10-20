import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URL } from '../../config.js';

const PRODUCT_TYPES = [
  { value: 'laptop', label: '💻 Laptop' },
  { value: 'phone', label: '📱 Phone' },
];

const PHONE_BRANDS = ['Infinix', 'Tecno', 'Itel', 'iPhone', 'Samsung', 'Redmi', 'Oppo', 'Vivo', 'OnePlus', 'Nokia', 'Xiaomi', 'Realme'];
const LAPTOP_BRANDS = ['Dell', 'HP', 'Lenovo', 'Apple', 'Asus', 'Acer', 'Microsoft', 'Toshiba', 'MSI', 'Razer'];

const COMMON_RAM = ['4GB', '6GB', '8GB', '12GB', '16GB', '32GB', '64GB'];
const COMMON_STORAGE = ['64GB', '128GB', '256GB', '512GB', '1TB', '2TB'];
const CONDITIONS = ['Brand New', 'Ex-UK', 'Refurbished', 'Used - Excellent', 'Used - Good'];

const CATEGORIES = [
  { value: 'students', label: '🎓 Students' },
  { value: 'office', label: '💼 Office Work' },
  { value: 'gaming', label: '🎮 Gaming' },
  { value: 'engineering', label: '⚙️ Engineering' },
];

const empty = {
  productType: 'laptop',
  brand: '', model: '', categories: [], processor: '', generation: '',
  ram: '', storage: '', screenSize: '', gpu: '', operatingSystem: '',
  battery: '', camera: '', simSlots: '',
  condition: 'Ex-UK', price: '', description: '', stockStatus: 'available',
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
            productType: l.productType || 'laptop',
            brand: l.brand || '', model: l.model || '',
            categories: l.categories || [], processor: l.processor || '',
            generation: l.generation || '', ram: l.ram || '',
            storage: l.storage || '', screenSize: l.screenSize || '',
            gpu: l.gpu || '', operatingSystem: l.operatingSystem || '',
            battery: l.battery || '', camera: l.camera || '', simSlots: l.simSlots || '',
            condition: l.condition || 'Ex-UK', price: l.price ?? '',
            description: l.description || '', stockStatus: l.stockStatus || 'available',
            featured: !!l.featured, images: l.images || [],
          });
        }
      });
    }
  }, [id, isEdit]);

  // Auto-generate description when specs change
  useEffect(() => {
    if (!isEdit && form.brand && form.model && !form.description) {
      const isPhone = form.productType === 'phone';
      const specs = isPhone 
        ? `${form.ram ? form.ram + ' RAM, ' : ''}${form.storage ? form.storage + ' Storage, ' : ''}${form.battery ? form.battery + ' Battery' : ''}`.replace(/, $/, '')
        : `${form.processor || ''} ${form.generation ? form.generation + ' Gen, ' : ''}${form.ram ? form.ram + ' RAM, ' : ''}${form.storage || ''}`.replace(/, $/, '');
      
      form.description = `Get the powerful ${form.brand} ${form.model} in ${form.condition} condition. ${specs ? `Features include ${specs}.` : ''} Perfect for everyday use. WhatsApp us to order!`;
      setForm(prev => ({ ...prev })); // Trigger re-render
    }
  }, [form.brand, form.model, form.ram, form.storage, form.battery, form.processor, form.generation, form.productType, isEdit]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  
  const toggleCategory = (c) =>
    setForm((f) => ({
      ...f,
      categories: f.categories.includes(c)
        ? f.categories.filter((x) => x !== c)
        : [...f.categories, c],
    }));

  const handleTypeChange = (type) => {
    set('productType', type);
    set('brand', '');
    set('operatingSystem', type === 'phone' ? 'Android' : 'Windows 11');
    set('description', ''); // Reset auto-desc
  };

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
      toast.success('Images uploaded successfully');
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
      toast.error('Brand, model, and price are required');
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price) };
      const headers = { Authorization: `Bearer ${localStorage.getItem('pt_token')}` };
      if (isEdit) {
        await axios.put(`${API_URL}/laptops/${id}`, payload, { headers });
        toast.success('Product updated successfully!');
      } else {
        await axios.post(`${API_URL}/laptops`, payload, { headers });
        toast.success('Product added successfully!');
      }
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const inputCls = 'w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition';
  const selectCls = 'w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition appearance-none';

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <Link to="/admin" className="text-sm font-semibold text-slate-700 hover:text-slate-900">← Back to Dashboard</Link>
          <h1 className="text-sm font-bold text-slate-900">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
          <div className="w-24" />
        </div>
      </header>

      <form onSubmit={submit} className="mx-auto max-w-4xl px-4 py-6 space-y-6">
        
        {/* 1. PRODUCT TYPE */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-bold text-slate-900 mb-4">1. Product Type</h2>
          <div className="flex gap-3">
            {PRODUCT_TYPES.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => handleTypeChange(type.value)}
                className={`flex-1 rounded-xl border-2 px-4 py-3 text-sm font-bold transition ${
                  form.productType === type.value
                    ? 'border-brand-600 bg-brand-50 text-brand-700'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div8>
        </div>

        {/* 2. BASIC INFO */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-bold text-slate-900 mb-4">2. Basic Information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">Brand *</label>
              <input 
                list={`brands-${form.productType}`}
                value={form.brand} 
                onChange={(e) => set('brand', e.target.value)} 
                className={inputCls} 
                required 
                placeholder="Type or select..."
              />
              <datalist id={`brands-${form.productType}`}>
                {(form.productType === 'phone' ? PHONE_BRANDS : LAPTOP_BRANDS).map(b => <option key={b} value={b} />)}
              </datalist>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">Model *</label>
              <input value={form.model} onChange={(e) => set('model', e.target.value)} className={inputCls} required placeholder="e.g., Latitude 5420 / Hot 30" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-sate-600">Price (KSh) *</label>
              <input type="number" value={form.price} onChange={(e) => set('price', e.target.value)} className={inputCls} required placeholder="35000" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">Condition</label>
              <select value={form.condition} onChange={(e) => set('condition', e.target.value)} className={selectCls}>
                {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* 3. SPECIFICATIONS (DYNAMIC) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-bold text-slate-900 mb-4">3. Specifications</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            
            {/* SHARED FIELDS */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">RAM</label>
              <input list="ram-options" value={form.ram} onChange={(e) => set('ram', e.target.value)} className={inputCls} placeholder="e.g., 8GB" />
              <datalist id="ram-options">{COMMON_RAM.map(r => <option key={r} value={r} />)}</datalist>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">Storage</label>
              <input list="storage-options" value={form.storage} onChange={(e) => set('storage', e.target.value)} className={inputCls} placeholder="e.g., 256GB SSD" />
              <datalist id="storage-options">{COMMON_STORAGE.map(s => <option key={s} value={s} />)}</datalist>
            </div>

            {/* LAPTOP ONLY */}
            {form.productType === 'laptop' && (
              <>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600">Processor</label>
                  <input value={form.processor} onChange={(e) => set('processor', e.target.value)} className={inputCls} placeholder="e.g., Intel Core i5" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600">Generation</label>
                  <input value={form.generation} onChange={(e) => set('generation', e.target.value)} className={inputCls} placeholder="e.g., 11th" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600">Screen Size</label>
                  <input value={form.screenSize} onChange={(e) => set('screenSize', e.target.value)} className={inputCls} placeholder='e.g., 14"' />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600">GPU</label>
                  <input value={form.gpu} onChange={(e) => set('gpu', e.target.value)} className={inputCls} placeholder="e.g., Intel Iris Xe" />
                </div>
              </>
            )}

            {/* PHONE ONLY */}
            {form.productType === 'phone' && (
              <>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600">Battery</label>
                  <input value={form.battery} onChange={(e) => set('battery', e.target.value)} className={inputCls} placeholder="e.g., 5000mAh" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600">Camera</label>
                  <input value={form.camera} onChange={(e) => set('camera', e.target.value)} className={inputCls} placeholder="e.g., 50MP Main" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600">SIM Slots</label>
                  <input value={form.simSlots} onChange={(e) => set('simSlots', e.target.value)} className={inputCls} placeholder="e.g., Dual SIM" />
                </div>
              </>
            )}

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">Operating System</label>
              <input value={form.operatingSystem} onChange={(e) => set('operatingSystem', e.target.value)} className={inputCls} placeholder={form.productType === 'phone' ? 'Android' : 'Windows 11'} />
            </div>
          </div>
        </div>

        {/* 4. CATEGORIES & STATUS */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-bold text-slate-900 mb-4">4. Categories & Status</h2>
          
          <div className="mb-4">
            <label className="mb-2 block text-xs font-semibold text-slate-600">Target Audience (Select multiple)</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => {
                const active = form.categories.includes(c.value);
                return (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => toggleCategory(c.value)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ring-1 transition ${
                      active ? 'bg-slate-900 text-white ring-slate-900' : 'bg-white text-slate-700 ring-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">Stock Status</label>
              <select value={form.stockStatus} onChange={(e) => set('stockStatus', e.target.value)} className={selectCls}>
                <option value="available">✅ Available</option>
                <option value="low_stock">⚠️ Low Stock</option>
                <option value="sold_out">❌ Sold Out</option>
              </select>
            </div>
            <div className="flex items-end pb-2">
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 w-full hover:bg-slate-100 transition">
                <input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} className="h-5 w-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
                <span className="text-sm font-semibold text-slate-700">⭐ Mark as Featured</span>
              </label>
            </div>
          </div>
        </div>

        {/* 5. DESCRIPTION (AUTO-GENERATED) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-bold text-slate-900 mb-2">5. Description</h2>
          <p className="text-xs text-slate-500 mb-3">This is auto-generated based on your specs above. You can edit it if needed.</p>
          <textarea
            rows="3"
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            className={`${inputCls} resize-none`}
          />
        </div>

        {/* 6. IMAGES */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-bold text-slate-900 mb-2">6. Product Images</h2>
          <p className="text-xs text-slate-500 mb-3">First image will be the cover. You can select multiple images at once.</p>

          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center transition hover:border-brand-400 hover:bg-brand-50">
            <input type="file" accept="image/*" multiple onChange={(e) => uploadImages(e.target.files)} className="hidden" />
            <span className="text-2xl mb-2">📸</span a>
            <span className="text-sm font-bold text-slate-700">
              {uploading ? 'Uploading...' : 'Click here to upload images'}
            </span>
            <span className="mt-1 text-xs text-slate-500">JPG, PNG, WebP (Max 5MB each)</span>
          </label>

          {form.images.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {form.images.map((img, i) => (
                <div key={img.publicId || i} className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-white">
                  <img src={img.url} alt="" className="h-full w-full object-contain p-1" />
                  <button
                    type="button"
                    onClick={() => removeImage(img.publicId, i)}
                    className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white opacity-0 shadow-sm group-hover:opacity-100 transition"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                  {i === 0 && (
                    <span className="absolute left-1 bottom-1 rounded bg-slate-900 px-1.5 py-0.5 text-[10px] font-bold text-white">COVER</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SAVE BUTTONS */}
        <div className="sticky bottom-4 flex items-center justify-end gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-lg">
          <Link to="/admin" className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving || uploading}
            className="rounded-xl bg-brand-600 px-8 py-3 text-sm font-bold text-white hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md"
          >
            {saving ? 'Saving...' : isEdit ? 'Update Product' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
}