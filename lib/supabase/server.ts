import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
    // In Next.js 15 and 16, cookies() is asynchronous and must be awaited
    const cookieStore = await cookies()

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                // 1. Lets Supabase read all cookies from the incoming request
                getAll() {
                    return cookieStore.getAll()
                },
                // 2. Lets Supabase write or delete auth token cookies on login/logout
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // Next.js does not allow Server Components to write cookies during rendering.
                        // We wrap it in a try/catch so it doesn't crash, because your proxy.ts 
                        // file will handle refreshing cookies instead.
                    }
                },
            },
        }
    )
}