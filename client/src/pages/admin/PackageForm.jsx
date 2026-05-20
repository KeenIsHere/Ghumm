import { useState, useEffect, useRef } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const EXCHANGE_RATE = 133;

const emptyForm = {
  title: '',
  tagline: '',
  location: 'Pokhara, Nepal',
  description: '',
  difficulty: 'Moderate',
  difficultyNote: '',
  duration: 4,
  maxAltitude: '',
  season: '',
  bestSeasonTip: '',
  trekType: 'Teahouse',
  maxGroupSize: 20,
  availableSlots: 20,
  price: '',
  priceUSD: '',
  premiumPrice: '',
  pricingType: 'per_person',
  includes: [],
  excludes: [],
  itinerary: [{ day: 1, description: '', walkingHours: '' }],
  permits: [],
  images: [],
  availableDates: [],
  isActive: true,
  isPremiumOnly: false,
  isFeatured: false,
  status: 'draft',
};

function adaptEditing(pkg) {
  return {
    ...emptyForm,
    ...pkg,
    includes: pkg.includes || [],
    excludes: pkg.excludes || [],
    itinerary: pkg.itinerary?.length
      ? pkg.itinerary.map(it => ({ day: it.day, description: it.description || it.title || '', walkingHours: it.walkingHours || '' }))
      : [{ day: 1, description: '', walkingHours: '' }],
    permits: pkg.permits || [],
    images: pkg.images?.length
      ? (typeof pkg.images[0] === 'string'
          ? [{ url: pkg.coverImage || pkg.images[0], isCover: true, order: 0 }]
          : pkg.images)
      : pkg.coverImage
        ? [{ url: pkg.coverImage, isCover: true, order: 0 }]
        : [],
    availableDates: pkg.availableDates || pkg.startDates || [],
    maxAltitude: pkg.maxAltitude || pkg.elevation || '',
    price: pkg.price || '',
    premiumPrice: pkg.premiumPrice || '',
    priceUSD: pkg.priceUSD || (pkg.price ? Math.round(pkg.price / EXCHANGE_RATE) : ''),
  };
}

function calcCompletion(form) {
  let filled = 0;
  if (form.title?.trim()) filled++;
  if (form.tagline?.trim()) filled++;
  if (form.description?.trim() && form.description.length >= 50) filled++;
  if (form.difficulty) filled++;
  if (Number(form.duration) >= 1) filled++;
  if (Number(form.price) > 0) filled++;
  if (form.includes?.length >= 1) filled++;
  if (form.itinerary?.some(d => d.description?.trim())) filled++;
  if (form.images?.length >= 1) filled++;
  if (form.availableDates?.length >= 1) filled++;
  return Math.round((filled / 10) * 100);
}

function validate(form, forPublish = false) {
  const errs = {};
  if (!form.title?.trim()) errs.title = 'Title is required';
  else if (form.title.length > 80) errs.title = 'Max 80 characters';
  if (!form.tagline?.trim()) errs.tagline = 'Tagline is required';
  else if (form.tagline.length > 100) errs.tagline = 'Max 100 characters';
  if (!form.description?.trim()) errs.description = 'Description is required';
  else if (form.description.length < 100) errs.description = 'Minimum 100 characters required';
  if (!form.price || Number(form.price) <= 0) errs.price = 'Price must be greater than 0';
  if (!form.duration || Number(form.duration) < 1) errs.duration = 'Duration must be at least 1 day';
  if (!form.maxGroupSize || Number(form.maxGroupSize) < 1) errs.maxGroupSize = 'Required';
  if (Number(form.availableSlots) > Number(form.maxGroupSize)) errs.availableSlots = 'Cannot exceed max group size';
  if (forPublish) {
    if (!form.itinerary?.some(d => d.description?.trim())) errs.itinerary = 'Add at least 1 itinerary day description';
    if (!form.availableDates?.length) errs.availableDates = 'Add at least 1 departure date';
    if (!form.images?.length) errs.images = 'Add at least 1 image';
    if (!form.includes?.length) errs.includes = 'Add at least 1 include item';
  }
  return errs;
}

function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <div
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${checked ? 'bg-[#1D9E75]' : 'bg-gray-300'}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </div>
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
}

function Section({ icon, iconBg, title, subtitle, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-4">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
        <span className={`w-9 h-9 rounded-lg flex items-center justify-center text-base ${iconBg}`}>{icon}</span>
        <div>
          <p className="font-semibold text-gray-900 text-sm">{title}</p>
          {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function TagInput({ items, onAdd, onRemove, placeholder, color }) {
  const [input, setInput] = useState('');
  const handleKey = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault();
      onAdd(input.trim().replace(/,$/, ''));
      setInput('');
    }
  };
  const handleBlur = () => {
    if (input.trim()) {
      onAdd(input.trim().replace(/,$/, ''));
      setInput('');
    }
  };
  const isGreen = color === 'green';
  return (
    <div className={`min-h-[3rem] p-2 border rounded-lg flex flex-wrap gap-1.5 focus-within:ring-2 focus-within:ring-[#1D9E75]/30 focus-within:border-[#1D9E75] transition-colors ${isGreen ? 'border-green-200 bg-green-50/40' : 'border-red-200 bg-red-50/30'}`}>
      {items.map((item, i) => (
        <span key={i} className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${isGreen ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
          <span>{isGreen ? '✓' : '✕'}</span>
          {item}
          <button type="button" onClick={() => onRemove(i)} className="ml-0.5 opacity-60 hover:opacity-100 text-base leading-none">&times;</button>
        </span>
      ))}
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKey}
        onBlur={handleBlur}
        placeholder={items.length === 0 ? placeholder : 'Add item...'}
        className="flex-1 min-w-[140px] bg-transparent text-sm outline-none px-1 py-0.5 placeholder-gray-400"
      />
    </div>
  );
}

const inputCls = (err) =>
  `w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/30 focus:border-[#1D9E75] transition-colors ${err ? 'border-red-400 bg-red-50/30' : 'border-gray-300'}`;

function Field({ label, required, hint, error, children, span2 }) {
  return (
    <div className={span2 ? 'md:col-span-2' : ''}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
        {hint && <span className="text-xs font-normal text-gray-400 ml-1">— {hint}</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export default function PackageForm({ onBack, editing, onSaved }) {
  const [form, setForm] = useState(editing ? adaptEditing(editing) : { ...emptyForm });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [dateInput, setDateInput] = useState('');
  const fileInputRef = useRef(null);

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }));

  useEffect(() => {
    const usd = form.price ? Math.round(Number(form.price) / EXCHANGE_RATE) : '';
    setForm(f => ({ ...f, priceUSD: usd }));
  }, [form.price]);

  const completion = calcCompletion(form);

  // Itinerary
  const addDay = () => set('itinerary', [...form.itinerary, { day: form.itinerary.length + 1, description: '', walkingHours: '' }]);
  const removeDay = (i) => set('itinerary', form.itinerary.filter((_, idx) => idx !== i).map((d, idx) => ({ ...d, day: idx + 1 })));
  const updateDay = (i, field, value) => set('itinerary', form.itinerary.map((d, idx) => idx === i ? { ...d, [field]: value } : d));

  // Permits
  const addPermit = () => set('permits', [...form.permits, { name: '', cost: '' }]);
  const removePermit = (i) => set('permits', form.permits.filter((_, idx) => idx !== i));
  const updatePermit = (i, field, value) => set('permits', form.permits.map((p, idx) => idx === i ? { ...p, [field]: value } : p));

  // Images
  const handleImageFiles = (files) => {
    const remaining = 8 - form.images.length;
    if (remaining <= 0) { toast.error('Maximum 8 images allowed'); return; }
    Array.from(files).slice(0, remaining).forEach(file => {
      if (!file.type.startsWith('image/')) { toast.error('Only image files allowed'); return; }
      if (file.size > 5 * 1024 * 1024) { toast.error(`${file.name} exceeds 5MB limit`); return; }
      const reader = new FileReader();
      reader.onload = (ev) => {
        setForm(f => ({
          ...f,
          images: [...f.images, { url: ev.target.result, isCover: f.images.length === 0, order: f.images.length }],
        }));
      };
      reader.readAsDataURL(file);
    });
  };
  const removeImage = (i) => {
    setForm(f => {
      const updated = f.images.filter((_, idx) => idx !== i).map((img, idx) => ({ ...img, order: idx }));
      if (updated.length > 0 && !updated.some(img => img.isCover)) updated[0].isCover = true;
      return { ...f, images: updated };
    });
  };
  const setCover = (i) => set('images', form.images.map((img, idx) => ({ ...img, isCover: idx === i })));

  // Dates
  const addDate = () => {
    if (!dateInput) return;
    const d = new Date(dateInput).toISOString();
    if (!form.availableDates.some(x => new Date(x).toDateString() === new Date(d).toDateString())) {
      set('availableDates', [...form.availableDates, d]);
    }
    setDateInput('');
  };

  const handleSave = async (publish = false) => {
    const errs = validate(form, publish);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      toast.error(publish ? 'Fix all errors before publishing' : 'Fix errors before saving');
      // scroll to first error
      setTimeout(() => document.querySelector('[data-error]')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
      return;
    }
    setErrors({});
    setSaving(true);
    try {
      const coverImg = form.images.find(img => img.isCover)?.url || form.images[0]?.url || '';
      const payload = {
        ...form,
        price: Number(form.price),
        priceUSD: Number(form.priceUSD) || Math.round(Number(form.price) / EXCHANGE_RATE),
        premiumPrice: Number(form.premiumPrice) || 0,
        duration: Number(form.duration),
        maxGroupSize: Number(form.maxGroupSize),
        availableSlots: Number(form.availableSlots),
        coverImage: coverImg,
        status: publish ? 'published' : 'draft',
        isActive: publish ? form.isActive : false,
      };
      if (editing) {
        await API.put(`/packages/${editing._id}`, payload);
        toast.success(publish ? '🚀 Package published!' : '💾 Draft saved');
      } else {
        await API.post('/packages', payload);
        toast.success(publish ? '🚀 Package published!' : '💾 Draft saved');
      }
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save package');
    } finally {
      setSaving(false);
    }
  };

  const diffBadge = {
    Easy: 'bg-green-100 text-green-700',
    Moderate: 'bg-amber-100 text-amber-700',
    Difficult: 'bg-orange-100 text-orange-700',
    Expert: 'bg-red-100 text-red-700',
  };

  return (
    <div className="flex-1 bg-gray-50 min-h-screen flex flex-col">
      {/* Sticky top bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4 sticky top-0 z-20">
        <button type="button" onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors">
          <span className="text-base">←</span> Back
        </button>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <h1 className="text-base font-bold text-gray-900 truncate">
            {editing ? 'Edit package' : 'Create new package'}
          </h1>
          <span className={`px-2 py-0.5 rounded text-xs font-semibold border shrink-0 ${form.status === 'published' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-amber-100 text-amber-700 border-amber-200'}`}>
            {form.status === 'published' ? 'Published' : 'Draft'}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button type="button" onClick={onBack} className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-1.5 text-sm border border-gray-400 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
          >
            💾 Save draft
          </button>
          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-1.5 text-sm bg-[#1D9E75] text-white rounded-lg hover:bg-[#178a65] font-medium transition-colors disabled:opacity-50"
          >
            ✈ Publish package
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-white border-b border-gray-100 px-6 py-2.5">
        <div className="flex items-center gap-3 max-w-3xl">
          <div className="flex-1 bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-[#1D9E75] h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${completion}%` }}
            />
          </div>
          <span className="text-xs text-gray-500 whitespace-nowrap">
            Form completion: {completion}%{completion < 100 ? ' — fill in itinerary, images and dates to finish' : ' — ready to publish!'}
          </span>
        </div>
      </div>

      {/* Form body */}
      <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-6">

        {/* 1 · Basic Information */}
        <Section icon="📄" iconBg="bg-teal-50 text-teal-600" title="Basic information" subtitle="Shown as the main listing title">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Package title" required error={errors.title}>
              <input
                value={form.title}
                onChange={e => set('title', e.target.value)}
                maxLength={80}
                placeholder="e.g. Poon Hill Sunrise Trek"
                className={inputCls(errors.title)}
                data-error={errors.title ? 'true' : undefined}
              />
              <p className="text-xs text-gray-400 mt-0.5 text-right">{form.title.length}/80</p>
            </Field>

            <Field label="Location" required error={errors.location}>
              <input
                value={form.location}
                onChange={e => set('location', e.target.value)}
                className={inputCls(errors.location)}
              />
            </Field>

            <Field label="Short tagline" required hint="1 sentence shown on listing card" error={errors.tagline} span2>
              <input
                value={form.tagline}
                onChange={e => set('tagline', e.target.value)}
                maxLength={100}
                placeholder="e.g. Iconic sunrise viewpoint over Annapurna & Dhaulagiri"
                className={inputCls(errors.tagline)}
              />
              <p className="text-xs text-gray-400 mt-0.5 text-right">{form.tagline.length}/100</p>
            </Field>

            <Field label="Full description" required hint="what to expect, highlights, trail overview" error={errors.description} span2>
              <textarea
                value={form.description}
                onChange={e => set('description', e.target.value)}
                rows={5}
                placeholder="Describe the experience in detail. Mention scenic highlights, villages, culture, trail type and what makes this trek unique..."
                className={inputCls(errors.description)}
              />
              <p className="text-xs text-gray-400 mt-0.5">{form.description.length} chars (min 100)</p>
            </Field>
          </div>
        </Section>

        {/* 2 · Trek Details */}
        <Section icon="🧭" iconBg="bg-amber-50 text-amber-600" title="Trek details" subtitle="Displayed as spec badges on listing">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Field label="Difficulty" required error={errors.difficulty}>
              <select value={form.difficulty} onChange={e => set('difficulty', e.target.value)} className={inputCls(false)}>
                {['Easy', 'Moderate', 'Difficult', 'Expert'].map(d => (
                  <option key={d}>{d}</option>
                ))}
              </select>
              {form.difficulty && (
                <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${diffBadge[form.difficulty]}`}>{form.difficulty}</span>
              )}
            </Field>

            <Field label="Duration (days)" required error={errors.duration}>
              <input type="number" value={form.duration} onChange={e => set('duration', e.target.value)} min={1} className={inputCls(errors.duration)} />
            </Field>

            <Field label="Max group size" required error={errors.maxGroupSize}>
              <input type="number" value={form.maxGroupSize} onChange={e => set('maxGroupSize', e.target.value)} min={1} className={inputCls(errors.maxGroupSize)} />
            </Field>

            <Field label="Available slots" error={errors.availableSlots}>
              <input type="number" value={form.availableSlots} onChange={e => set('availableSlots', e.target.value)} min={0} className={inputCls(errors.availableSlots)} />
            </Field>

            <Field label="Max altitude">
              <input value={form.maxAltitude} onChange={e => set('maxAltitude', e.target.value)} placeholder="3,210m" className={inputCls(false)} />
            </Field>

            <Field label="Season">
              <input value={form.season} onChange={e => set('season', e.target.value)} placeholder="Mar–May, Oct–Nov" className={inputCls(false)} />
            </Field>

            <Field label="Trek type">
              <select value={form.trekType} onChange={e => set('trekType', e.target.value)} className={inputCls(false)}>
                {['Teahouse', 'Camping', 'Mixed'].map(t => <option key={t}>{t}</option>)}
              </select>
            </Field>

            <div />

            <Field label="Difficulty note" hint="shown in detail view" span2>
              <input value={form.difficultyNote} onChange={e => set('difficultyNote', e.target.value)} placeholder="e.g. 5–7 hrs daily, stone steps, moderate elevation gain" className={inputCls(false)} />
            </Field>

            <Field label="Best season tip" hint="shown on listing card" span2>
              <input value={form.bestSeasonTip} onChange={e => set('bestSeasonTip', e.target.value)} placeholder="e.g. Mar–Apr for rhododendrons in full bloom" className={inputCls(false)} />
            </Field>
          </div>
        </Section>

        {/* 3 · Pricing */}
        <Section icon="💰" iconBg="bg-blue-50 text-blue-600" title="Pricing" subtitle="Both currencies displayed to users">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Field label="Price (Rs.)" required error={errors.price}>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₨</span>
                <input
                  type="number"
                  value={form.price}
                  onChange={e => set('price', e.target.value)}
                  min={0}
                  placeholder="9,000"
                  className={`${inputCls(errors.price)} pl-7`}
                />
              </div>
            </Field>

            <Field label="Price (USD)" hint="auto-calculated">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                <input
                  type="number"
                  value={form.priceUSD}
                  readOnly
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 pl-7 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-gray-400 mt-0.5">1 USD = {EXCHANGE_RATE} NPR</p>
            </Field>

            <Field label="Premium price (Rs.)">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₨</span>
                <input
                  type="number"
                  value={form.premiumPrice}
                  onChange={e => set('premiumPrice', e.target.value)}
                  min={0}
                  placeholder="2,000"
                  className={`${inputCls(false)} pl-7`}
                />
              </div>
            </Field>

            <Field label="Per person / group">
              <select value={form.pricingType} onChange={e => set('pricingType', e.target.value)} className={inputCls(false)}>
                <option value="per_person">Per person</option>
                <option value="per_group">Per group</option>
              </select>
            </Field>
          </div>
        </Section>

        {/* 4 · Includes & Excludes */}
        <Section icon="📋" iconBg="bg-emerald-50 text-emerald-600" title="Includes & excludes" subtitle="Type and press Enter to add items">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">What's included</p>
              <TagInput
                items={form.includes}
                onAdd={item => set('includes', [...form.includes, item])}
                onRemove={i => set('includes', form.includes.filter((_, idx) => idx !== i))}
                placeholder="Accommodation, All meals, Guide..."
                color="green"
              />
              {errors.includes && <p className="text-xs text-red-500 mt-1" data-error="true">{errors.includes}</p>}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">What's excluded</p>
              <TagInput
                items={form.excludes}
                onAdd={item => set('excludes', [...form.excludes, item])}
                onRemove={i => set('excludes', form.excludes.filter((_, idx) => idx !== i))}
                placeholder="Tips, Flights, Insurance..."
                color="red"
              />
            </div>
          </div>
        </Section>

        {/* 5 · Day-by-Day Itinerary */}
        <Section icon="🗺️" iconBg="bg-orange-50 text-orange-500" title="Day-by-day itinerary" subtitle="Each day shown in detail view">
          <div className="space-y-2">
            <div className="grid gap-2 text-xs font-medium text-gray-400 px-1 mb-1" style={{ gridTemplateColumns: '2.5rem 1fr 5.5rem 2rem' }}>
              <span>Day</span><span>Description</span><span>Walk time</span><span />
            </div>
            {form.itinerary.map((day, i) => (
              <div key={i} className="grid gap-2 items-center" style={{ gridTemplateColumns: '2.5rem 1fr 5.5rem 2rem' }}>
                <div className="w-9 h-9 rounded-lg bg-[#1D9E75]/10 text-[#1D9E75] flex items-center justify-center text-xs font-bold">
                  D{day.day}
                </div>
                <input
                  value={day.description}
                  onChange={e => updateDay(i, 'description', e.target.value)}
                  placeholder={`Describe day ${day.day} activities...`}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/30 focus:border-[#1D9E75] transition-colors"
                />
                <input
                  value={day.walkingHours}
                  onChange={e => updateDay(i, 'walkingHours', e.target.value)}
                  placeholder="hrs"
                  className="border border-gray-300 rounded-lg px-2 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/30 focus:border-[#1D9E75] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => removeDay(i)}
                  disabled={form.itinerary.length === 1}
                  className="text-gray-400 hover:text-red-500 disabled:opacity-20 text-xl leading-none transition-colors"
                >
                  &times;
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addDay}
              className="w-full mt-2 py-2.5 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-[#1D9E75] hover:text-[#1D9E75] transition-colors"
            >
              + Add another day
            </button>
          </div>
          {errors.itinerary && <p className="text-xs text-red-500 mt-2" data-error="true">{errors.itinerary}</p>}
        </Section>

        {/* 6 · Required Permits */}
        <Section icon="🎫" iconBg="bg-purple-50 text-purple-600" title="Required permits" subtitle="Shown in package detail view">
          <div className="space-y-2">
            {form.permits.map((permit, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  value={permit.name}
                  onChange={e => updatePermit(i, 'name', e.target.value)}
                  placeholder="Permit name (e.g. ACAP)"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/30 focus:border-[#1D9E75] transition-colors"
                />
                <input
                  value={permit.cost}
                  onChange={e => updatePermit(i, 'cost', e.target.value)}
                  placeholder="Cost (e.g. NPR 3,000 ~USD 23)"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/30 focus:border-[#1D9E75] transition-colors"
                />
                <button type="button" onClick={() => removePermit(i)} className="text-gray-400 hover:text-red-500 text-xl leading-none transition-colors">&times;</button>
              </div>
            ))}
            <button
              type="button"
              onClick={addPermit}
              className="w-full py-2.5 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-[#1D9E75] hover:text-[#1D9E75] transition-colors"
            >
              + Add permit
            </button>
          </div>
        </Section>

        {/* 7 · Images */}
        <Section icon="🖼️" iconBg="bg-pink-50 text-pink-500" title="Images" subtitle="First image = cover. Up to 8 photos.">
          {form.images.length > 0 && (
            <div className="grid grid-cols-4 gap-3 mb-3">
              {form.images.map((img, i) => (
                <div key={i} className={`relative rounded-xl overflow-hidden border-2 transition-colors ${img.isCover ? 'border-[#1D9E75]' : 'border-gray-200'}`}>
                  <img src={img.url} alt="" className="w-full h-20 object-cover" />
                  {img.isCover && (
                    <span className="absolute bottom-1 left-1 bg-[#1D9E75] text-white text-[10px] px-1.5 py-0.5 rounded font-semibold">Cover</span>
                  )}
                  <div className="absolute top-1 right-1 flex gap-1">
                    {!img.isCover && (
                      <button
                        type="button"
                        onClick={() => setCover(i)}
                        title="Set as cover"
                        className="w-5 h-5 bg-white/90 rounded text-[10px] flex items-center justify-center hover:bg-[#1D9E75] hover:text-white transition-colors"
                      >
                        ⊙
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="w-5 h-5 bg-white/90 rounded text-xs flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                    >
                      &times;
                    </button>
                  </div>
                </div>
              ))}
              {form.images.length < 8 && Array.from({ length: Math.min(4 - (form.images.length % 4 || 4), 8 - form.images.length) }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-20 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-300 hover:border-[#1D9E75] hover:text-[#1D9E75] transition-colors text-xl"
                >
                  +
                </button>
              ))}
            </div>
          )}
          <label
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); handleImageFiles(e.dataTransfer.files); }}
            className="flex flex-col items-center justify-center w-full py-8 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-[#1D9E75] transition-colors bg-gray-50/50"
          >
            <span className="text-3xl mb-2">☁️</span>
            <p className="text-sm text-gray-600 font-medium">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB each · {form.images.length}/8 images</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={e => handleImageFiles(e.target.files)}
              className="hidden"
            />
          </label>
          {errors.images && <p className="text-xs text-red-500 mt-2" data-error="true">{errors.images}</p>}
        </Section>

        {/* 8 · Available Dates */}
        <Section icon="📅" iconBg="bg-cyan-50 text-cyan-600" title="Available dates" subtitle="Shown as clickable date pills to users">
          <div className="flex flex-wrap gap-2 mb-3">
            {form.availableDates.map((d, i) => (
              <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-lg text-sm font-medium text-gray-700">
                📅 {new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                <button type="button" onClick={() => set('availableDates', form.availableDates.filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-red-500 ml-0.5 transition-colors">&times;</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="date"
              value={dateInput}
              onChange={e => setDateInput(e.target.value)}
              onBlur={() => dateInput && addDate()}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/30 focus:border-[#1D9E75] transition-colors"
            />
            <button
              type="button"
              onClick={addDate}
              className="px-4 py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-[#1D9E75] hover:text-[#1D9E75] transition-colors"
            >
              + Add date
            </button>
          </div>
          {errors.availableDates && <p className="text-xs text-red-500 mt-2" data-error="true">{errors.availableDates}</p>}
        </Section>

        {/* 9 · Visibility & Settings */}
        <Section icon="⚙️" iconBg="bg-slate-100 text-slate-600" title="Visibility & settings" subtitle="">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Toggle checked={form.isActive} onChange={v => set('isActive', v)} label="Active (published)" />
            <Toggle checked={form.isPremiumOnly} onChange={v => set('isPremiumOnly', v)} label="Premium only" />
            <Toggle checked={form.isFeatured} onChange={v => set('isFeatured', v)} label="Featured on homepage" />
            {/* 'Show on explore map' removed per UI change request */}
          </div>
        </Section>

        {/* Bottom action bar */}
        <div className="flex justify-end gap-3 pt-2 pb-10">
          <button type="button" onClick={onBack} className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 border border-gray-400 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            💾 Save draft
          </button>
          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#1D9E75] text-white rounded-lg text-sm font-medium hover:bg-[#178a65] transition-colors disabled:opacity-50"
          >
            ✈ Publish package
          </button>
        </div>
      </div>
    </div>
  );
}
