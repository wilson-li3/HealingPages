import { useEffect, useRef, useState } from 'react';
import FloatingDoodles, { DONATE_DOODLES } from './FloatingDoodles';
import PolaroidWall, { DONATE_POLAROIDS } from './PolaroidWall';
import { supabase } from '../lib/supabase';

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  pickup_address: string;
  book_quantity: string;
  book_condition: number | null;
  message: string;
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

const INITIAL_FORM: FormData = {
  name: '',
  email: '',
  phone: '',
  pickup_address: '',
  book_quantity: '',
  book_condition: null,
  message: '',
};

const CONDITION_LABELS = ['Poor', 'Fair', 'Good', 'Very Good', 'Like New'];

function validate(data: FormData): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!data.name || data.name.trim().length < 2) errors.name = 'Name must be at least 2 characters';
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Please enter a valid email';
  if (!data.pickup_address || data.pickup_address.trim().length < 5) errors.pickup_address = 'Address must be at least 5 characters';
  if (!data.book_quantity || Number(data.book_quantity) < 1) errors.book_quantity = 'At least 1 book required';
  if (data.book_condition === null) errors.book_condition = 'Please select a condition';
  return errors;
}

export default function DonateForm() {
  const { ref, inView } = useInView();
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<FormStatus>('idle');
  const [submitError, setSubmitError] = useState('');

  const set = (field: keyof FormData, value: string | number | null) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setStatus('submitting');
    setSubmitError('');

    if (!supabase) {
      setSubmitError('Supabase is not configured. Please set up environment variables.');
      setStatus('error');
      return;
    }

    const { error } = await supabase.from('donations').insert({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      pickup_address: form.pickup_address.trim(),
      book_quantity: Number(form.book_quantity),
      book_condition: form.book_condition,
      message: form.message.trim() || null,
    });

    if (error) {
      setSubmitError('Something went wrong. Please try again.');
      setStatus('error');
    } else {
      setStatus('success');
    }
  };

  const reset = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    setStatus('idle');
    setSubmitError('');
  };

  return (
    <section
      id="donate"
      ref={ref}
      className="relative bg-navy-light overflow-hidden snap-section flex items-center"
      style={{ minHeight: '100vh', padding: 'clamp(6rem, 12vw, 11rem) 0' }}
    >
      <PolaroidWall polaroids={DONATE_POLAROIDS} />
      <FloatingDoodles doodles={DONATE_DOODLES} color="var(--color-accent-yellow)" />

      <div
        className={`relative w-full transition-all duration-700 ${
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 clamp(2rem, 6vw, 6rem)' }}
      >
        {/* Header */}
        <div className="text-center" style={{ marginBottom: 'clamp(2.5rem, 5vw, 3.5rem)' }}>
          <span className="text-accent-yellow text-xs font-semibold tracking-[0.2em] uppercase font-body block">
            Get Involved
          </span>
          <h3
            className="font-display text-white leading-[0.95]"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginTop: '1.25rem' }}
          >
            Donate your books
          </h3>
        </div>

        {/* Form card */}
        <div
          className="mx-auto rounded-2xl border border-white/[0.06] bg-white/[0.02]"
          style={{ maxWidth: '720px', padding: 'clamp(1.5rem, 4vw, 2.5rem)' }}
        >
          {status === 'success' ? (
            <div className="flex flex-col items-center text-center" style={{ padding: '2rem 0' }}>
              <div className="w-16 h-16 rounded-full border-2 border-accent-yellow/40 bg-accent-yellow/10 flex items-center justify-center" style={{ marginBottom: '1.5rem' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-yellow">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h4 className="font-display text-white" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: '0.75rem' }}>
                Thank you!
              </h4>
              <p className="text-white/50 text-sm font-body" style={{ maxWidth: '360px', marginBottom: '1.5rem' }}>
                Your donation info has been received. We'll reach out to schedule a pickup soon.
              </p>
              <button
                onClick={reset}
                className="text-sm font-body text-accent-yellow border border-accent-yellow/30 rounded-xl transition-colors duration-200 hover:bg-accent-yellow/10 cursor-pointer"
                style={{ padding: '0.625rem 1.5rem' }}
              >
                Donate more
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              {submitError && (
                <div
                  className="rounded-xl border border-red-400/20 bg-red-400/5 text-red-300 text-sm font-body"
                  style={{ padding: '0.75rem 1rem', marginBottom: '1.25rem' }}
                >
                  {submitError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 'clamp(0.875rem, 2vw, 1.25rem)' }}>
                {/* Name */}
                <div>
                  <label className="block text-white/40 text-xs font-body" style={{ marginBottom: '0.375rem' }}>Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => set('name', e.target.value)}
                    placeholder="Your name"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm font-body placeholder:text-white/25 focus:border-accent-yellow/40 focus:bg-white/[0.06] outline-none transition-colors duration-200"
                    style={{ padding: '0.75rem 1rem' }}
                  />
                  {errors.name && <p className="text-red-400/80 text-xs font-body" style={{ marginTop: '0.25rem' }}>{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-white/40 text-xs font-body" style={{ marginBottom: '0.375rem' }}>Email *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => set('email', e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm font-body placeholder:text-white/25 focus:border-accent-yellow/40 focus:bg-white/[0.06] outline-none transition-colors duration-200"
                    style={{ padding: '0.75rem 1rem' }}
                  />
                  {errors.email && <p className="text-red-400/80 text-xs font-body" style={{ marginTop: '0.25rem' }}>{errors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-white/40 text-xs font-body" style={{ marginBottom: '0.375rem' }}>Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => set('phone', e.target.value)}
                    placeholder="(optional)"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm font-body placeholder:text-white/25 focus:border-accent-yellow/40 focus:bg-white/[0.06] outline-none transition-colors duration-200"
                    style={{ padding: '0.75rem 1rem' }}
                  />
                </div>

                {/* Pickup Address */}
                <div>
                  <label className="block text-white/40 text-xs font-body" style={{ marginBottom: '0.375rem' }}>Pickup Address *</label>
                  <input
                    type="text"
                    value={form.pickup_address}
                    onChange={(e) => set('pickup_address', e.target.value)}
                    placeholder="123 Main St, Pittsburgh, PA"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm font-body placeholder:text-white/25 focus:border-accent-yellow/40 focus:bg-white/[0.06] outline-none transition-colors duration-200"
                    style={{ padding: '0.75rem 1rem' }}
                  />
                  {errors.pickup_address && <p className="text-red-400/80 text-xs font-body" style={{ marginTop: '0.25rem' }}>{errors.pickup_address}</p>}
                </div>

                {/* Book Quantity */}
                <div>
                  <label className="block text-white/40 text-xs font-body" style={{ marginBottom: '0.375rem' }}>Book Quantity *</label>
                  <input
                    type="number"
                    min="1"
                    value={form.book_quantity}
                    onChange={(e) => set('book_quantity', e.target.value)}
                    placeholder="How many books?"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm font-body placeholder:text-white/25 focus:border-accent-yellow/40 focus:bg-white/[0.06] outline-none transition-colors duration-200"
                    style={{ padding: '0.75rem 1rem' }}
                  />
                  {errors.book_quantity && <p className="text-red-400/80 text-xs font-body" style={{ marginTop: '0.25rem' }}>{errors.book_quantity}</p>}
                </div>

                {/* Book Condition */}
                <div>
                  <label className="block text-white/40 text-xs font-body" style={{ marginBottom: '0.375rem' }}>Book Condition *</label>
                  <div className="flex" style={{ gap: '0.375rem' }}>
                    {CONDITION_LABELS.map((label, i) => {
                      const value = i + 1;
                      const selected = form.book_condition === value;
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => set('book_condition', value)}
                          className={`flex-1 flex flex-col items-center rounded-lg border text-xs font-body transition-colors duration-200 cursor-pointer ${
                            selected
                              ? 'border-accent-yellow bg-accent-yellow/15 text-accent-yellow'
                              : 'border-white/[0.08] bg-white/[0.02] text-white/35 hover:border-white/[0.15] hover:text-white/50'
                          }`}
                          style={{ padding: '0.5rem 0.25rem' }}
                        >
                          <span className="font-semibold" style={{ fontSize: '0.8125rem' }}>{value}</span>
                          <span className="hidden sm:block" style={{ fontSize: '0.5625rem', marginTop: '0.125rem' }}>{label}</span>
                        </button>
                      );
                    })}
                  </div>
                  {errors.book_condition && <p className="text-red-400/80 text-xs font-body" style={{ marginTop: '0.25rem' }}>{errors.book_condition}</p>}
                </div>

                {/* Message */}
                <div className="md:col-span-2">
                  <label className="block text-white/40 text-xs font-body" style={{ marginBottom: '0.375rem' }}>Message</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => set('message', e.target.value)}
                    placeholder="Anything else you'd like us to know? (optional)"
                    rows={3}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm font-body placeholder:text-white/25 focus:border-accent-yellow/40 focus:bg-white/[0.06] outline-none transition-colors duration-200 resize-none"
                    style={{ padding: '0.75rem 1rem' }}
                  />
                </div>
              </div>

              {/* Submit */}
              <div style={{ marginTop: 'clamp(1.25rem, 3vw, 1.75rem)' }}>
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full sm:w-auto bg-accent-yellow text-navy font-semibold text-sm font-body rounded-xl transition-opacity duration-200 hover:opacity-90 disabled:opacity-60 cursor-pointer"
                  style={{ padding: '0.875rem 2.5rem' }}
                >
                  {status === 'submitting' ? (
                    <span className="inline-flex items-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.3" />
                        <path d="M12 2a10 10 0 019.8 8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    'Submit Donation'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
