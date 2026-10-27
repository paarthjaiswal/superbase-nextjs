import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { signout } from '@/app/auth/actions'

export default async function DashboardPage() {
  const supabase = await createClient()

  // 1. Verify the user's token on the server by reading the auth cookie
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 2. Safety check: Even though proxy.ts guards this route, always verify here too
  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Dashboard
          </h1>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
            Signed In
          </span>
        </div>

        <div className="mb-6 space-y-3 rounded-lg bg-zinc-50 p-4 text-sm dark:bg-zinc-800/50">
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Email</p>
            <p className="font-medium text-zinc-900 dark:text-zinc-100">
              {user.email}
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">User ID</p>
            <p className="font-mono text-xs text-zinc-700 dark:text-zinc-300">
              {user.id}
            </p>
          </div>
        </div>

        {/* 3. Sign Out Form wired to your signout Server Action */}
        <form action={signout}>
          <button
            type="submit"
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
          >
            Sign Out
          </button>
        </form>
      </div>
    </div>
  )
}