export const FITNESS_LEVELS = ["beginner", "intermediate", "advanced"] as const
export type FitnessLevel = (typeof FITNESS_LEVELS)[number]

export const GOALS = [
  "muscle_gain",
  "fat_loss",
  "strength",
  "endurance",
  "general_fitness",
] as const
export type Goal = (typeof GOALS)[number]

export const EQUIPMENT_OPTIONS = [
  "none",
  "dumbbells",
  "barbell",
  "resistance_bands",
  "machines",
  "kettlebells",
  "full_gym",
] as const
export type Equipment = (typeof EQUIPMENT_OPTIONS)[number]

export const MUSCLE_GROUPS = [
  "Chest",
  "Back",
  "Shoulders",
  "Biceps",
  "Triceps",
  "Legs",
  "Glutes",
  "Core",
  "Full Body",
] as const
export type MuscleGroup = (typeof MUSCLE_GROUPS)[number]

export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  created_at: string
}

export interface Exercise {
  name: string
  sets: number
  reps: string
  rest_seconds: number
  muscle_group: string
  notes?: string
}

export interface WorkoutDay {
  day: number
  title: string
  focus: string
  exercises: Exercise[]
}

export interface GenerateRoutineInput {
  fitness_level: FitnessLevel
  goal: Goal
  equipment: Equipment
  days_per_week: number
  target_muscles: string[]
}

export interface GeneratedRoutine {
  title: string
  plan: WorkoutDay[]
}

export interface Routine extends GenerateRoutineInput {
  id: string
  user_id: string
  title: string
  plan: WorkoutDay[]
  created_at: string
}
