import { redirect } from 'next/navigation'

// Default locale
const DEFAULT_LOCALE = 'en'

export default function Home() {
  redirect(`/${DEFAULT_LOCALE}`)
}
