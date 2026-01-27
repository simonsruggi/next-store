import { createBrowserClient } from '@supabase/ssr';

function isDemoMode(): boolean {
  return !process.env.NEXT_PUBLIC_SUPABASE_URL ||
         process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co' ||
         process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');
}

export function createClient() {
  // In demo mode, return a mock client that does nothing
  if (isDemoMode()) {
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        signOut: async () => ({ error: null }),
        signInWithPassword: async () => ({ data: { user: null, session: null }, error: { message: 'Demo mode - login disabled' } }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({ data: null, error: null }),
            order: () => ({ data: [], error: null }),
          }),
          order: () => ({ data: [], error: null }),
        }),
      }),
    } as any;
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
