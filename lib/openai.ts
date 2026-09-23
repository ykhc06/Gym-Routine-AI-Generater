import OpenAI from "openai"
import { EQUIPMENT_LABELS, FITNESS_LEVEL_LABELS, GOAL_LABELS } from "@/lib/labels"
import type { GeneratedRoutine, GenerateRoutineInput } from "@/lib/types"
import { generatedRoutineSchema } from "@/lib/validations"

const SYSTEM_PROMPT = `You are GymRoutineAI, an expert strength and conditioning coach.
Return ONLY valid JSON that matches this shape:
{
  "title": "string",
  "plan": [
    {
      "day": 1,
      "title": "string",
      "focus": "string",
      "exercises": [
        {
          "name": "string",
          "sets": 3,
          "reps": "8-12",
          "rest_seconds": 90,
          "muscle_group": "string",
          "notes": "optional cue"
        }
      ]
    }
  ]
}

Rules:
- Generate exactly the requested number of training days.
- Each day must include 4 to 7 exercises.
- Respect available equipment. Do not prescribe unavailable machines or free weights.
- Match volume and intensity to the fitness level (beginner = lower volume, longer rest; advanced = more intensity).
- Prioritize the requested muscle groups while keeping the program balanced.
- Keep rest days implicit: only return training days.
- Use practical, common exercise names.`

export async function generateRoutine(
  input: GenerateRoutineInput
): Promise<GeneratedRoutine> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  const userPrompt = [
    `Fitness level: ${FITNESS_LEVEL_LABELS[input.fitness_level]}`,
    `Goal: ${GOAL_LABELS[input.goal]}`,
    `Equipment: ${EQUIPMENT_LABELS[input.equipment]}`,
    `Training days per week: ${input.days_per_week}`,
    `Target muscle groups: ${input.target_muscles.join(", ")}`,
    "Create a personalized weekly workout routine.",
  ].join("\n")

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.7,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
  })

  const content = completion.choices[0]?.message?.content
  if (!content) {
    throw new Error("The model returned an empty routine.")
  }

  const parsedJson: unknown = JSON.parse(content)
  const parsed = generatedRoutineSchema.safeParse(parsedJson)

  if (!parsed.success) {
    throw new Error("The model returned an invalid routine format.")
  }

  if (parsed.data.plan.length !== input.days_per_week) {
    parsed.data.plan = parsed.data.plan.slice(0, input.days_per_week)
  }

  return parsed.data
}
