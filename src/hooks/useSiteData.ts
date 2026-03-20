import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import {
  IMPACT_POLAROIDS,
  MEDICAL_POLAROIDS,
  ABOUT_POLAROIDS,
  PARTNERS_POLAROIDS,
  ACK_POLAROIDS,
  DONATE_POLAROIDS,
} from '../components/PolaroidWall';
import type { Polaroid } from '../components/PolaroidWall';

// ── Stats ──

export interface Stat {
  id: string;
  value: number;
  label: string;
  display_order: number;
}

const DEFAULT_STATS: Stat[] = [
  { id: 'books_collected', value: 500, label: 'Books Collected', display_order: 0 },
  { id: 'read_alouds', value: 10, label: 'Read-Aloud Sessions', display_order: 1 },
  { id: 'schools_impacted', value: 10, label: 'Schools Impacted', display_order: 2 },
];

export function useStats() {
  const [stats, setStats] = useState<Stat[]>(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }

    supabase
      .from('site_stats')
      .select('*')
      .order('display_order')
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          setStats(data);
        }
        setLoading(false);
      });
  }, []);

  return { stats, loading };
}

// ── Settings ──

export function useSetting(key: string) {
  const [value, setValue] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }

    supabase
      .from('site_settings')
      .select('value')
      .eq('key', key)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!error && data) setValue(data.value);
        setLoading(false);
      });
  }, [key]);

  return { value, loading };
}

// ── Polaroids ──

const FALLBACK_MAP: Record<string, Polaroid[]> = {
  impact: IMPACT_POLAROIDS,
  medical: MEDICAL_POLAROIDS,
  about: ABOUT_POLAROIDS,
  partners: PARTNERS_POLAROIDS,
  ack: ACK_POLAROIDS,
  donate: DONATE_POLAROIDS,
};

export function usePolaroids(section: string) {
  const fallback = FALLBACK_MAP[section] ?? [];
  const [polaroids, setPolaroids] = useState<Polaroid[]>(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }

    supabase
      .from('polaroids')
      .select('*')
      .eq('section', section)
      .order('display_order')
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          setPolaroids(
            data.map((row) => ({
              x: row.x,
              y: row.y,
              rotation: row.rotation,
              caption: row.caption,
              illustration: row.illustration ?? 'reading',
              width: row.width,
              image_url: row.image_url ?? undefined,
            })),
          );
        }
        setLoading(false);
      });
  }, [section]);

  return { polaroids, loading };
}
