import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// Server-side Supabase client — no Database generic to avoid 'never' type inference issues.
// Cast query results explicitly with the types from database.types.ts
export const createServerClient = () =>
  createServerComponentClient({ cookies });
