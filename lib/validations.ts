import { z } from "zod"
import { EQUIPMENT_OPTIONS, FITNESS_LEVELS, GOALS } from "@/lib/types"

export const generateRoutineInputSchema = z.object({
  fitness_level: z.enum(FITNESS_LEVELS),
  goal: z.enum(GOALS),
  equipment: z.enum(EQUIPMENT_OPTIONS),
  days_per_week: z.number().int().min(2).max(6),
  target_muscles: z.array(z.string().min(1)).min(1).max(8),
})

export const exerciseSchema = z.object({
  name: z.string().min(1),
  sets: z.coerce.number().int().min(1).max(10),
  reps: z.union([z.string(), z.number()]).transform((value) => String(value)),
  rest_seconds: z.coerce.number().int().min(0).max(600),
  muscle_group: z.string().min(1),
  notes: z.string().optional(),
})

export const workoutDaySchema = z.object({
  day: z.coerce.number().int().min(1).max(7),
  title: z.string().min(1),
  focus: z.string().min(1),
  exercises: z.array(exerciseSchema).min(3).max(10),
})

export const generatedRoutineSchema = z.object({
  title: z.string().min(1),
  plan: z.array(workoutDaySchema).min(1).max(6),
})
