// Server-only: uses next/headers via supabase-server — never import in client components
import { createServerClient } from './supabase-server';
import { SETTING_DEFAULTS, type SiteSettings } from './site-settings';

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const supabase = createServerClient();
    const { data } = await supabase.from('site_settings').select('key, value');
    if (!data?.length) return SETTING_DEFAULTS;

    const map: Record<string, string> = {};
    for (const row of data as { key: string; value: string }[]) {
      map[row.key] = row.value;
    }
    return { ...SETTING_DEFAULTS, ...map } as SiteSettings;
  } catch {
    return SETTING_DEFAULTS;
  }
}
