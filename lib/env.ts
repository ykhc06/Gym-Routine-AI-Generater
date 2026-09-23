const PLACEHOLDER_URL = "https://placeholder.supabase.co"
const PLACEHOLDER_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTIwMDAsImV4cCI6MTk2MDc2ODAwMH0.placeholder"

function isPlaceholder(value: string | undefined) {
  if (!value) return true
  return value.includes("your-supabase") || value.includes("your-openai")
}

export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const configured = Boolean(url && anonKey && !isPlaceholder(url) && !isPlaceholder(anonKey))

  return {
    url: configured ? url! : PLACEHOLDER_URL,
    anonKey: configured ? anonKey! : PLACEHOLDER_ANON_KEY,
    configured,
  }
}

export function isOpenAIConfigured() {
  const key = process.env.OPENAI_API_KEY
  return Boolean(key && !isPlaceholder(key))
}
