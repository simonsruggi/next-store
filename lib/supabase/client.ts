import { createBrowserClient } from '@supabase/ssr';

function isDemoMode(): boolean {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || '')
    .trim()
    .replace(/\\n/g, '')
    .replace(/\n/g, '');
  const anonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '')
    .trim()
    .replace(/\\n/g, '')
    .replace(/\n/g, '');

  const urlLooksPlaceholder =
    !url || url === 'https://placeholder.supabase.co' || url.includes('placeholder');
  const anonKeyLooksPlaceholder =
    !anonKey || anonKey === 'anon_placeholder' || anonKey.includes('placeholder');

  // Treat any missing/placeholder config as demo mode to avoid crashing the app bundle.
  return urlLooksPlaceholder || anonKeyLooksPlaceholder;
}

// Create a chainable mock query builder
function createMockQueryBuilder() {
  const result = { data: [], error: null, count: 0 };
  const builder: any = {
    select: () => builder,
    insert: () => builder,
    update: () => builder,
    delete: () => builder,
    eq: () => builder,
    neq: () => builder,
    gt: () => builder,
    gte: () => builder,
    lt: () => builder,
    lte: () => builder,
    like: () => builder,
    ilike: () => builder,
    is: () => builder,
    in: () => builder,
    contains: () => builder,
    order: () => builder,
    limit: () => builder,
    range: () => builder,
    single: async () => ({ data: null, error: null }),
    maybeSingle: async () => ({ data: null, error: null }),
    then: (resolve: any) => resolve(result),
    data: [],
    error: null,
    count: 0,
  };
  return builder;
}

export function createClient() {
  // In demo mode, return a mock client that does nothing
  if (isDemoMode()) {
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        signOut: async () => ({ error: null }),
        signInWithPassword: async () => ({ data: { user: null, session: null }, error: { message: 'Demo mode - login disabled' } }),
        signUp: async () => ({ data: { user: null, session: null }, error: { message: 'Demo mode - registration disabled' } }),
        resetPasswordForEmail: async () => ({ error: { message: 'Demo mode - password reset disabled' } }),
      },
      from: () => createMockQueryBuilder(),
    } as any;
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
