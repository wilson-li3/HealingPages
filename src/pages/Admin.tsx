import { useEffect, useState, useRef, type CSSProperties } from 'react';
import { supabase } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';
import type { Stat } from '../hooks/useSiteData';

// ── Types ──

interface PolaroidRow {
  id: string;
  section: string;
  image_url: string | null;
  caption: string;
  x: string;
  y: string;
  rotation: number;
  width: number;
  illustration: string;
  display_order: number;
}

const SECTIONS = ['impact', 'medical', 'about', 'partners', 'ack', 'donate'] as const;

// ── Shared styles ──

const colors = {
  bg: '#09090b',
  card: '#18181b',
  cardBorder: '#27272a',
  inputBg: '#09090b',
  inputBorder: '#3f3f46',
  inputFocus: '#3b82f6',
  text: '#fafafa',
  textMuted: '#a1a1aa',
  textDim: '#71717a',
  blue: '#3b82f6',
  blueHover: '#2563eb',
  red: '#ef4444',
  redBg: 'rgba(239,68,68,0.1)',
  green: '#4ade80',
  divider: '#27272a',
};

const inputStyle: CSSProperties = {
  width: '100%',
  background: colors.inputBg,
  border: `1px solid ${colors.inputBorder}`,
  borderRadius: 8,
  color: colors.text,
  fontSize: 13,
  padding: '8px 12px',
  outline: 'none',
  fontFamily: 'inherit',
};

const labelStyle: CSSProperties = {
  display: 'block',
  color: colors.textDim,
  fontSize: 11,
  marginBottom: 4,
  fontWeight: 500,
};

const btnPrimary: CSSProperties = {
  background: colors.blue,
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  fontSize: 12,
  fontWeight: 600,
  padding: '8px 16px',
  cursor: 'pointer',
  fontFamily: 'inherit',
};

const btnSecondary: CSSProperties = {
  background: '#27272a',
  color: colors.textMuted,
  border: `1px solid ${colors.cardBorder}`,
  borderRadius: 8,
  fontSize: 12,
  padding: '7px 14px',
  cursor: 'pointer',
  fontFamily: 'inherit',
};

const btnDanger: CSSProperties = {
  background: colors.redBg,
  color: colors.red,
  border: 'none',
  borderRadius: 8,
  fontSize: 12,
  padding: '8px 14px',
  cursor: 'pointer',
  fontFamily: 'inherit',
};

// ── Login ──

function Login({ onLogin }: { onLogin: (s: Session) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) { setError('Supabase is not configured.'); return; }
    setLoading(true);
    setError('');
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) { setError(err.message); return; }
    if (data.session) onLogin(data.session);
  };

  return (
    <div style={{ minHeight: '100vh', background: colors.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 380, background: colors.card, borderRadius: 16, border: `1px solid ${colors.cardBorder}`, padding: 32 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: colors.text, textAlign: 'center', marginBottom: 8 }}>Healing Pages</h1>
        <p style={{ fontSize: 13, color: colors.textDim, textAlign: 'center', marginBottom: 28 }}>Admin Dashboard</p>
        {error && <p style={{ color: colors.red, fontSize: 13, textAlign: 'center', marginBottom: 16, padding: '8px 12px', background: colors.redBg, borderRadius: 8 }}>{error}</p>}

        <label style={labelStyle}>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ ...inputStyle, marginBottom: 16 }} required />

        <label style={labelStyle}>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ ...inputStyle, marginBottom: 24 }} required />

        <button type="submit" disabled={loading} style={{ ...btnPrimary, width: '100%', padding: '10px 0', fontSize: 14, opacity: loading ? 0.6 : 1 }}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}

// ── Toast ──

function Toast({ message, onClear }: { message: string; onClear: () => void }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onClear, 3000);
    return () => clearTimeout(t);
  }, [message, onClear]);

  if (!message) return null;

  const isError = message.startsWith('Error');
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 50,
      background: isError ? '#7f1d1d' : '#14532d',
      color: isError ? '#fca5a5' : colors.green,
      fontSize: 13, fontWeight: 500, padding: '10px 20px',
      borderRadius: 10, boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      {message}
    </div>
  );
}

// ── Founder Photo ──

function FounderPhoto({ onMessage }: { onMessage: (m: string) => void }) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!supabase) return;
    supabase.from('site_settings').select('value').eq('key', 'founder_photo_url').maybeSingle().then(({ data }) => {
      if (data) setPhotoUrl(data.value);
    });
  }, []);

  const upload = async (file: File) => {
    if (!supabase) return;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `founder/photo.${ext}`;
    const { error: uploadErr } = await supabase.storage.from('polaroids').upload(path, file, { upsert: true });
    if (uploadErr) { onMessage(`Error: ${uploadErr.message}`); setUploading(false); return; }

    const { data: urlData } = supabase.storage.from('polaroids').getPublicUrl(path);
    const url = urlData.publicUrl;

    // Upsert the setting
    await supabase.from('site_settings').upsert({ key: 'founder_photo_url', value: url });
    setPhotoUrl(url);
    setUploading(false);
    onMessage('Founder photo updated');
  };

  const remove = async () => {
    if (!supabase) return;
    await supabase.from('site_settings').delete().eq('key', 'founder_photo_url');
    setPhotoUrl(null);
    onMessage('Founder photo removed');
  };

  return (
    <div>
      <h2 style={{ fontSize: 16, fontWeight: 700, color: colors.text, marginBottom: 16 }}>Founder Photo</h2>
      <div style={{ background: colors.card, borderRadius: 12, border: `1px solid ${colors.cardBorder}`, padding: 20, display: 'flex', alignItems: 'center', gap: 20 }}>
        {/* Preview */}
        <div style={{
          width: 96, height: 128, flexShrink: 0,
          background: colors.inputBg, borderRadius: 10,
          border: `1px solid ${colors.cardBorder}`,
          overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {photoUrl ? (
            <img src={photoUrl} alt="Founder" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ color: colors.textDim, fontSize: 11, textAlign: 'center', padding: 8 }}>No photo</span>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p style={{ color: colors.textMuted, fontSize: 13, margin: 0 }}>
            {photoUrl ? 'Photo uploaded — visible on the About section.' : 'Upload a photo for the About the Founder section.'}
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = ''; }} />
            <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{ ...btnPrimary, opacity: uploading ? 0.6 : 1 }}>
              {uploading ? 'Uploading...' : photoUrl ? 'Replace Photo' : 'Upload Photo'}
            </button>
            {photoUrl && <button onClick={remove} style={btnDanger}>Remove</button>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Stats Editor ──

function StatsEditor({ onMessage }: { onMessage: (m: string) => void }) {
  const [stats, setStats] = useState<Stat[]>([]);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;
    supabase.from('site_stats').select('*').order('display_order').then(({ data }) => {
      if (data) setStats(data);
    });
  }, []);

  const updateStat = (id: string, field: keyof Stat, value: string | number) => {
    setStats((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const saveStat = async (stat: Stat) => {
    if (!supabase) return;
    setSaving(stat.id);
    const { error } = await supabase.from('site_stats').update({ value: stat.value, label: stat.label }).eq('id', stat.id);
    setSaving(null);
    onMessage(error ? `Error: ${error.message}` : `Saved "${stat.label}"`);
  };

  return (
    <div>
      <h2 style={{ fontSize: 16, fontWeight: 700, color: colors.text, marginBottom: 16 }}>Impact Stats</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {stats.map((stat) => (
          <div key={stat.id} style={{ background: colors.card, borderRadius: 12, border: `1px solid ${colors.cardBorder}`, padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ minWidth: 140 }}>
                <label style={labelStyle}>ID</label>
                <p style={{ color: colors.textMuted, fontSize: 13, fontFamily: 'monospace', margin: 0, padding: '8px 0' }}>{stat.id}</p>
              </div>
              <div style={{ flex: 1, minWidth: 100 }}>
                <label style={labelStyle}>Value</label>
                <input type="number" value={stat.value} onChange={(e) => updateStat(stat.id, 'value', Number(e.target.value))} style={inputStyle} />
              </div>
              <div style={{ flex: 2, minWidth: 160 }}>
                <label style={labelStyle}>Label</label>
                <input type="text" value={stat.label} onChange={(e) => updateStat(stat.id, 'label', e.target.value)} style={inputStyle} />
              </div>
              <button onClick={() => saveStat(stat)} disabled={saving === stat.id} style={{ ...btnPrimary, opacity: saving === stat.id ? 0.6 : 1 }}>
                {saving === stat.id ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Polaroid Manager ──

function PolaroidManager({ onMessage }: { onMessage: (m: string) => void }) {
  const [polaroids, setPolaroids] = useState<PolaroidRow[]>([]);
  const [activeSection, setActiveSection] = useState<string>('impact');
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadTargetRef = useRef<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;
    supabase.from('polaroids').select('*').order('display_order').then(({ data }) => {
      if (data) setPolaroids(data);
    });
  }, []);

  const sectionPolaroids = polaroids.filter((p) => p.section === activeSection);

  const updateField = (id: string, field: keyof PolaroidRow, value: string | number | null) => {
    setPolaroids((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const savePolaroid = async (polaroid: PolaroidRow) => {
    if (!supabase) return;
    setSaving(true);
    const { error } = await supabase
      .from('polaroids')
      .update({
        caption: polaroid.caption, x: polaroid.x, y: polaroid.y,
        rotation: polaroid.rotation, width: polaroid.width,
        illustration: polaroid.illustration, image_url: polaroid.image_url,
        display_order: polaroid.display_order,
      })
      .eq('id', polaroid.id);
    setSaving(false);
    onMessage(error ? `Error: ${error.message}` : `Saved "${polaroid.caption}"`);
  };

  const addPolaroid = async () => {
    if (!supabase) return;
    const maxOrder = sectionPolaroids.reduce((max, p) => Math.max(max, p.display_order), -1);
    const { data, error } = await supabase
      .from('polaroids')
      .insert({ section: activeSection, caption: 'New polaroid', x: '50%', y: '50%', rotation: 0, width: 175, illustration: 'reading', display_order: maxOrder + 1 })
      .select().single();
    if (!error && data) {
      setPolaroids((prev) => [...prev, data]);
      onMessage('Added new polaroid');
    }
  };

  const deletePolaroid = async (id: string) => {
    if (!supabase) return;
    const { error } = await supabase.from('polaroids').delete().eq('id', id);
    if (!error) {
      setPolaroids((prev) => prev.filter((p) => p.id !== id));
      onMessage('Deleted polaroid');
    }
  };

  const uploadImage = async (polaroidId: string, file: File) => {
    if (!supabase) return;
    setUploadingId(polaroidId);
    const ext = file.name.split('.').pop();
    const path = `${polaroidId}.${ext}`;
    const { error: uploadError } = await supabase.storage.from('polaroids').upload(path, file, { upsert: true });
    if (uploadError) {
      onMessage(`Error: ${uploadError.message}`);
      setUploadingId(null);
      return;
    }
    const { data: urlData } = supabase.storage.from('polaroids').getPublicUrl(path);
    await supabase.from('polaroids').update({ image_url: urlData.publicUrl }).eq('id', polaroidId);
    updateField(polaroidId, 'image_url', urlData.publicUrl);
    setUploadingId(null);
    onMessage('Image uploaded');
  };

  const removeImage = async (polaroidId: string) => {
    if (!supabase) return;
    await supabase.from('polaroids').update({ image_url: null }).eq('id', polaroidId);
    updateField(polaroidId, 'image_url', null);
    onMessage('Image removed');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const targetId = uploadTargetRef.current;
    if (file && targetId) uploadImage(targetId, file);
    e.target.value = '';
    uploadTargetRef.current = null;
  };

  const triggerUpload = (id: string) => {
    uploadTargetRef.current = id;
    setUploadingId(id);
    fileInputRef.current?.click();
  };

  return (
    <div>
      <h2 style={{ fontSize: 16, fontWeight: 700, color: colors.text, marginBottom: 16 }}>Polaroid Manager</h2>

      {/* Section tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
        {SECTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setActiveSection(s)}
            style={{
              ...(activeSection === s ? btnPrimary : btnSecondary),
              textTransform: 'capitalize',
            }}
          >
            {s}
          </button>
        ))}
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {sectionPolaroids.map((p) => (
          <div key={p.id} style={{ background: colors.card, borderRadius: 12, border: `1px solid ${colors.cardBorder}`, padding: 20 }}>
            {/* Top row: preview + caption + image actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
              {/* Preview */}
              <div style={{
                width: 64, height: 64, flexShrink: 0,
                background: colors.inputBg, borderRadius: 8,
                border: `1px solid ${colors.cardBorder}`,
                overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {p.image_url ? (
                  <img src={p.image_url} alt={p.caption} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ color: colors.textDim, fontSize: 10, textAlign: 'center', padding: 4 }}>{p.illustration}</span>
                )}
              </div>

              {/* Caption (prominent) */}
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Caption</label>
                <input type="text" value={p.caption} onChange={(e) => updateField(p.id, 'caption', e.target.value)} style={inputStyle} />
              </div>

              {/* Image buttons */}
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <button onClick={() => triggerUpload(p.id)} disabled={uploadingId === p.id} style={{ ...btnSecondary, opacity: uploadingId === p.id ? 0.6 : 1 }}>
                  {uploadingId === p.id ? 'Uploading...' : p.image_url ? 'Replace' : 'Upload'}
                </button>
                {p.image_url && (
                  <button onClick={() => removeImage(p.id)} style={btnSecondary}>Remove</button>
                )}
              </div>
            </div>

            {/* Position/style fields in a compact grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 12, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>X</label>
                <input type="text" value={p.x} onChange={(e) => updateField(p.id, 'x', e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Y</label>
                <input type="text" value={p.y} onChange={(e) => updateField(p.id, 'y', e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Rotation</label>
                <input type="number" value={p.rotation} onChange={(e) => updateField(p.id, 'rotation', Number(e.target.value))} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Width</label>
                <input type="number" value={p.width} onChange={(e) => updateField(p.id, 'width', Number(e.target.value))} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Illustration</label>
                <select value={p.illustration} onChange={(e) => updateField(p.id, 'illustration', e.target.value)} style={inputStyle}>
                  {['reading', 'bookshelf', 'storytime', 'stacking', 'sharing'].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Order</label>
                <input type="number" value={p.display_order} onChange={(e) => updateField(p.id, 'display_order', Number(e.target.value))} style={inputStyle} />
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 12, borderTop: `1px solid ${colors.divider}` }}>
              <button onClick={() => deletePolaroid(p.id)} style={btnDanger}>Delete</button>
              <button onClick={() => savePolaroid(p)} disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.6 : 1 }}>Save</button>
            </div>
          </div>
        ))}
      </div>

      <button onClick={addPolaroid} style={{
        marginTop: 16, width: '100%', padding: '14px 0',
        background: 'transparent', border: `2px dashed ${colors.cardBorder}`,
        borderRadius: 12, color: colors.textDim, fontSize: 13,
        cursor: 'pointer', fontFamily: 'inherit',
      }}>
        + Add Polaroid
      </button>
    </div>
  );
}

// ── Main Admin Page ──

export default function Admin() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setLoading(false); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => { setSession(session); });
    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: colors.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <p style={{ color: colors.textDim, fontSize: 14 }}>Loading...</p>
      </div>
    );
  }

  if (!session) return <Login onLogin={setSession} />;

  const signOut = async () => { await supabase?.auth.signOut(); setSession(null); };

  return (
    <div style={{ minHeight: '100vh', background: colors.bg, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <header style={{ borderBottom: `1px solid ${colors.cardBorder}`, background: 'rgba(24,24,27,0.8)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 700, color: colors.text, margin: 0 }}>Healing Pages Admin</h1>
            <p style={{ fontSize: 12, color: colors.textDim, margin: '2px 0 0' }}>{session.user.email}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <a href="/" style={{ fontSize: 12, color: colors.textMuted, textDecoration: 'none' }}>View Site</a>
            <button onClick={signOut} style={btnSecondary}>Sign Out</button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
        <StatsEditor onMessage={setMessage} />
        <hr style={{ border: 'none', borderTop: `1px solid ${colors.divider}`, margin: '40px 0' }} />
        <FounderPhoto onMessage={setMessage} />
        <hr style={{ border: 'none', borderTop: `1px solid ${colors.divider}`, margin: '40px 0' }} />
        <PolaroidManager onMessage={setMessage} />
      </div>

      <Toast message={message} onClear={() => setMessage('')} />
    </div>
  );
}
