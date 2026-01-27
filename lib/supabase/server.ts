import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

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

  // Treat any missing/placeholder config as demo mode so SSG/SSR never crashes on misconfigured envs.
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

export async function createClient() {
  // In demo mode, return a mock client
  if (isDemoMode()) {
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
      },
      from: () => createMockQueryBuilder(),
    } as any;
  }

  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component
          }
        },
      },
    }
  );
}

export async function createServiceClient() {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || '')
    .trim()
    .replace(/\\n/g, '')
    .replace(/\n/g, '');
  const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '')
    .trim()
    .replace(/\\n/g, '')
    .replace(/\n/g, '');
  const urlLooksPlaceholder =
    !url || url === 'https://placeholder.supabase.co' || url.includes('placeholder');
  const serviceKeyLooksPlaceholder =
    !serviceRoleKey || serviceRoleKey === 'service_role_placeholder' || serviceRoleKey.includes('placeholder');

  // In demo mode, return a mock client
  if (urlLooksPlaceholder || serviceKeyLooksPlaceholder) {
    return {
      from: () => createMockQueryBuilder(),
    } as any;
  }

  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component
          }
        },
      },
    }
  );
}
