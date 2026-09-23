import { RoutineGeneratorForm } from "@/components/routine-generator-form"

export default function GeneratePage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-12">
      <div className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">
          Generator
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Create a personalized routine</h1>
        <p className="max-w-2xl text-muted-foreground">
          Choose how often you train, what equipment you have, and which muscles to prioritize.
          We will generate a full week of sessions.
        </p>
      </div>
      <RoutineGeneratorForm />
    </div>
  )
}
