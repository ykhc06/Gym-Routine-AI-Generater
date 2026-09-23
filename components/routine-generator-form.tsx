"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { EQUIPMENT_LABELS, FITNESS_LEVEL_LABELS, GOAL_LABELS } from "@/lib/labels"
import {
  EQUIPMENT_OPTIONS,
  FITNESS_LEVELS,
  GOALS,
  MUSCLE_GROUPS,
  type Equipment,
  type FitnessLevel,
  type Goal,
  type GenerateRoutineInput,
} from "@/lib/types"

const DAY_OPTIONS = [2, 3, 4, 5, 6] as const

export function RoutineGeneratorForm() {
  const router = useRouter()
  const [fitnessLevel, setFitnessLevel] = useState<FitnessLevel>("beginner")
  const [goal, setGoal] = useState<Goal>("general_fitness")
  const [equipment, setEquipment] = useState<Equipment>("full_gym")
  const [daysPerWeek, setDaysPerWeek] = useState<number>(3)
  const [targetMuscles, setTargetMuscles] = useState<string[]>(["Full Body"])
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const canSubmit = useMemo(
    () => targetMuscles.length > 0 && !submitting,
    [targetMuscles.length, submitting]
  )

  function toggleMuscle(muscle: string) {
    setTargetMuscles((current) => {
      if (current.includes(muscle)) {
        return current.filter((item) => item !== muscle)
      }
      return [...current, muscle]
    })
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (targetMuscles.length === 0) {
      setError("Select at least one muscle group.")
      return
    }

    const payload: GenerateRoutineInput = {
      fitness_level: fitnessLevel,
      goal,
      equipment,
      days_per_week: daysPerWeek,
      target_muscles: targetMuscles,
    }

    setSubmitting(true)
    try {
      const response = await fetch("/api/generate-routine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = (await response.json()) as { id?: string; error?: string }

      if (!response.ok || !data.id) {
        setError(data.error ?? "Could not generate a routine.")
        return
      }

      router.push(`/routines/${data.id}`)
      router.refresh()
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="border-border/70 bg-card/80">
      <CardHeader>
        <CardTitle>Build your week</CardTitle>
        <CardDescription>
          Tell GymRoutineAI how you train. We will generate a structured plan you can save and
          revisit.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Fitness level">
              <Select
                value={fitnessLevel}
                onValueChange={(value) => {
                  if (value) setFitnessLevel(value as FitnessLevel)
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false} align="start" className="w-full min-w-56">
                  {FITNESS_LEVELS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {FITNESS_LEVEL_LABELS[level]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Goal">
              <Select
                value={goal}
                onValueChange={(value) => {
                  if (value) setGoal(value as Goal)
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false} align="start" className="w-full min-w-56">
                  {GOALS.map((item) => (
                    <SelectItem key={item} value={item}>
                      {GOAL_LABELS[item]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Equipment">
              <Select
                value={equipment}
                onValueChange={(value) => {
                  if (value) setEquipment(value as Equipment)
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false} align="start" className="w-full min-w-56">
                  {EQUIPMENT_OPTIONS.map((item) => (
                    <SelectItem key={item} value={item}>
                      {EQUIPMENT_LABELS[item]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Days per week">
              <Select
                value={String(daysPerWeek)}
                onValueChange={(value) => {
                  if (value) setDaysPerWeek(Number(value))
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false} align="start" className="w-full min-w-56">
                  {DAY_OPTIONS.map((day) => (
                    <SelectItem key={day} value={String(day)}>
                      {day} days
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <div className="grid gap-2">
            <Label>Target muscle groups</Label>
            <div className="flex flex-wrap gap-2">
              {MUSCLE_GROUPS.map((muscle) => {
                const selected = targetMuscles.includes(muscle)
                return (
                  <Button
                    key={muscle}
                    type="button"
                    variant={selected ? "default" : "outline"}
                    onClick={() => toggleMuscle(muscle)}
                  >
                    {muscle}
                  </Button>
                )
              })}
            </div>
          </div>

          {error ? (
            <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}

          <Button type="submit" size="lg" disabled={!canSubmit} className="w-full sm:w-auto">
            {submitting ? (
              <>
                <Loader2 className="animate-spin" />
                Generating your routine
              </>
            ) : (
              "Generate routine"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      {children}
    </div>
  )
}
