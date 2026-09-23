"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Dumbbell } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

export function Navbar() {
  const router = useRouter()
  const [email, setEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth
      .getUser()
      .then(({ data }) => {
        setEmail(data.user?.email ?? null)
        setLoading(false)
      })
      .catch(() => setLoading(false))

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    setEmail(null)
    router.push("/")
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Dumbbell className="size-4" />
          </span>
          GymRoutineAI
        </Link>

        <nav className="flex shrink-0 items-center gap-1 sm:gap-2">
          {email ? (
            <>
              <Link href="/dashboard" className={buttonVariants({ variant: "ghost" })}>
                Dashboard
              </Link>
              <Link href="/generate" className={buttonVariants({ variant: "ghost" })}>
                Generate
              </Link>
              <Button variant="outline" onClick={handleLogout} disabled={loading}>
                Log out
              </Button>
            </>
          ) : (
            <Link href="/login" className={buttonVariants()}>
              Log in
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
