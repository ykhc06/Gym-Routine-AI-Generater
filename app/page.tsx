import Link from "next/link"
import { Dumbbell, Sparkles, Target, Timer } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"

const steps = [
  {
    icon: Target,
    title: "Set your goal",
    body: "Choose fitness level, goal, equipment, days per week, and the muscles you want to train.",
  },
  {
    icon: Sparkles,
    title: "Generate a plan",
    body: "GymRoutineAI builds a structured weekly routine with sets, reps, rest, and coaching notes.",
  },
  {
    icon: Timer,
    title: "Save and train",
    body: "Open any saved routine from your dashboard and follow it day by day.",
  },
]

export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-16 px-4 py-16">
      <section className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <p className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-primary">
            <Dumbbell className="size-3.5" />
            Personalized training
          </p>
          <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Build a workout routine that actually matches how you train.
          </h1>
          <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            Tell GymRoutineAI your level, goal, equipment, and target muscle groups. Get a
            week of focused sessions in seconds, then save it to your dashboard.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/generate" className={buttonVariants({ size: "lg" })}>
              Generate a routine
            </Link>
            <Link href="/login" className={buttonVariants({ size: "lg", variant: "outline" })}>
              Sign in
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card/70 p-6 shadow-2xl shadow-primary/5">
          <p className="text-sm font-medium text-primary">Sample week</p>
          <h2 className="mt-2 text-2xl font-semibold">Upper / Lower Strength Split</h2>
          <div className="mt-6 grid gap-3">
            {["Day 1 · Push strength", "Day 2 · Squat emphasis", "Day 3 · Pull hypertrophy"].map(
              (item) => (
                <div
                  key={item}
                  className="rounded-xl border border-border/60 bg-background/60 px-4 py-3 text-sm"
                >
                  {item}
                </div>
              )
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {steps.map((step) => (
          <div
            key={step.title}
            className="rounded-2xl border border-border/70 bg-card/60 p-5"
          >
            <step.icon className="mb-4 size-5 text-primary" />
            <h3 className="font-medium">{step.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.body}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
