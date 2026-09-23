import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Exercise } from "@/lib/types"

export function ExerciseCard({ exercise }: { exercise: Exercise }) {
  return (
    <Card size="sm" className="bg-card/80">
      <CardHeader className="flex-row items-start justify-between gap-3">
        <CardTitle className="text-base">{exercise.name}</CardTitle>
        <Badge variant="secondary">{exercise.muscle_group}</Badge>
      </CardHeader>
      <CardContent className="grid gap-2 text-sm text-muted-foreground">
        <p>
          <span className="font-medium text-foreground">
            {exercise.sets} x {exercise.reps}
          </span>
          <span className="mx-2 text-border">|</span>
          Rest {exercise.rest_seconds}s
        </p>
        {exercise.notes ? <p>{exercise.notes}</p> : null}
      </CardContent>
    </Card>
  )
}
