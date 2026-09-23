import { NextResponse } from "next/server"
import { isOpenAIConfigured } from "@/lib/env"
import { generateRoutine } from "@/lib/openai"
import { createClient } from "@/lib/supabase/server"
import { generateRoutineInputSchema } from "@/lib/validations"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Please sign in to generate a routine." }, { status: 401 })
    }

    if (!isOpenAIConfigured()) {
      return NextResponse.json(
        { error: "OpenAI is not configured. Add OPENAI_API_KEY to .env.local." },
        { status: 503 }
      )
    }

    const body: unknown = await request.json()
    const parsed = generateRoutineInputSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid routine options. Check your form and try again." },
        { status: 400 }
      )
    }

    const generated = await generateRoutine(parsed.data)

    await supabase.from("profiles").upsert({
      id: user.id,
      email: user.email,
    })

    const { data, error } = await supabase
      .from("routines")
      .insert({
        user_id: user.id,
        title: generated.title,
        fitness_level: parsed.data.fitness_level,
        goal: parsed.data.goal,
        equipment: parsed.data.equipment,
        days_per_week: parsed.data.days_per_week,
        target_muscles: parsed.data.target_muscles,
        plan: generated.plan,
      })
      .select("id")
      .single()

    if (error || !data) {
      return NextResponse.json(
        { error: error?.message ?? "Could not save the generated routine." },
        { status: 500 }
      )
    }

    return NextResponse.json({ id: data.id })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate a routine. Try again."
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
