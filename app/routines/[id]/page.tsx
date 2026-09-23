import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { ExerciseCard } from "@/components/exercise-card"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { EQUIPMENT_LABELS, FITNESS_LEVEL_LABELS, GOAL_LABELS, formatDate } from "@/lib/labels"
import { createClient } from "@/lib/supabase/server"
import type { Routine, WorkoutDay } from "@/lib/types"
import { workoutDaySchema } from "@/lib/validations"

type RoutinePageProps = {
  params: Promise<{ id: string }>
}

function parsePlan(plan: unknown): WorkoutDay[] {
  if (!Array.isArray(plan)) return []
  return plan.flatMap((day) => {
    const parsed = workoutDaySchema.safeParse(day)
    return parsed.success ? [parsed.data] : []
  })
}

export default async function RoutinePage({ params }: RoutinePageProps) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/login?next=/routines/${id}`)
  }

  const { data } = await supabase
    .from("routines")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle()

  if (!data) {
    notFound()
  }

  const routine = data as Routine
  const plan = parsePlan(routine.plan)

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-12">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
            Back to dashboard
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight">{routine.title}</h1>
          <p className="text-sm text-muted-foreground">{formatDate(routine.created_at)}</p>
          <div className="flex flex-wrap gap-2">
            <Badge>{GOAL_LABELS[routine.goal]}</Badge>
            <Badge variant="secondary">{FITNESS_LEVEL_LABELS[routine.fitness_level]}</Badge>
            <Badge variant="outline">{EQUIPMENT_LABELS[routine.equipment]}</Badge>
            <Badge variant="outline">{routine.days_per_week} days/week</Badge>
            {routine.target_muscles.map((muscle) => (
              <Badge key={muscle} variant="outline">
                {muscle}
              </Badge>
            ))}
          </div>
        </div>
        <Link href="/generate" className={buttonVariants({ variant: "outline" })}>
          Generate another
        </Link>
      </div>

      <div className="grid gap-8">
        {plan.map((day) => (
          <section key={`${day.day}-${day.title}`} className="grid gap-4">
            <div>
              <p className="text-sm font-medium text-primary">Day {day.day}</p>
              <h2 className="text-2xl font-semibold">{day.title}</h2>
              <p className="text-sm text-muted-foreground">{day.focus}</p>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {day.exercises.map((exercise) => (
                <ExerciseCard key={`${day.day}-${exercise.name}`} exercise={exercise} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
