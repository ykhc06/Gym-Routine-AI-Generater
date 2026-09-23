import Link from "next/link"
import { redirect } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EQUIPMENT_LABELS, FITNESS_LEVEL_LABELS, GOAL_LABELS, formatDate } from "@/lib/labels"
import { createClient } from "@/lib/supabase/server"
import type { Routine } from "@/lib/types"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?next=/dashboard")
  }

  const { data: routines } = await supabase
    .from("routines")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const items = (routines ?? []) as Routine[]

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">Dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Your routines</h1>
          <p className="mt-2 text-muted-foreground">
            Saved plans stay here so you can reopen them before training.
          </p>
        </div>
        <Link href="/generate" className={buttonVariants()}>
          Generate new routine
        </Link>
      </div>

      {items.length === 0 ? (
        <Card className="bg-card/70">
          <CardHeader>
            <CardTitle>No routines yet</CardTitle>
            <CardDescription>
              Generate your first personalized plan. It will show up here as soon as it is saved.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/generate" className={buttonVariants()}>
              Create a routine
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((routine) => (
            <Link key={routine.id} href={`/routines/${routine.id}`} className="group">
              <Card className="h-full transition-colors group-hover:bg-muted/40">
                <CardHeader>
                  <CardTitle className="text-xl">{routine.title}</CardTitle>
                  <CardDescription>{formatDate(routine.created_at)}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{GOAL_LABELS[routine.goal]}</Badge>
                  <Badge variant="outline">{routine.days_per_week} days/week</Badge>
                  <Badge variant="outline">{FITNESS_LEVEL_LABELS[routine.fitness_level]}</Badge>
                  <Badge variant="outline">{EQUIPMENT_LABELS[routine.equipment]}</Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
