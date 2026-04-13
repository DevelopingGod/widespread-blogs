import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// No <Database> generic — @supabase/supabase-js v2.100+ changed its dist
// structure, breaking auth-helpers-nextjs v0.10.0's GenericSchema import.
// Type safety is maintained through explicit TypeScript casts at usage sites.
export const createClient = () => createClientComponentClient();
