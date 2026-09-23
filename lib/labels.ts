import type { Equipment, FitnessLevel, Goal } from "@/lib/types"

export const FITNESS_LEVEL_LABELS: Record<FitnessLevel, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
}

export const GOAL_LABELS: Record<Goal, string> = {
  muscle_gain: "Muscle gain",
  fat_loss: "Fat loss",
  strength: "Strength",
  endurance: "Endurance",
  general_fitness: "General fitness",
}

export const EQUIPMENT_LABELS: Record<Equipment, string> = {
  none: "Bodyweight only",
  dumbbells: "Dumbbells",
  barbell: "Barbell",
  resistance_bands: "Resistance bands",
  machines: "Machines",
  kettlebells: "Kettlebells",
  full_gym: "Full gym",
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}
