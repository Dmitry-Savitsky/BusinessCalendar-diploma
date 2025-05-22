/**
 * Date and timezone utility functions
 */

// Convert a date to Europe/Minsk timezone
export const toMinskTimezone = (date: Date): Date => {
  // Create a new date with the timezone offset applied
  const offset = 3 // UTC+3 for Minsk
  const utc = date.getTime() + date.getTimezoneOffset() * 60000
  return new Date(utc + 3600000 * offset)
}

// Check if a date is today in Minsk timezone
export const isToday = (date: Date): boolean => {
  const today = new Date()
  const minskToday = toMinskTimezone(today)
  const minskDate = toMinskTimezone(date)

  return (
    minskToday.getDate() === minskDate.getDate() &&
    minskToday.getMonth() === minskDate.getMonth() &&
    minskToday.getFullYear() === minskDate.getFullYear()
  )
}

// Format a date string to display format with Minsk timezone
export const formatDateString = (dateString: string, format: Intl.DateTimeFormatOptions = {}): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    timeZone: "Europe/Minsk",
    ...format,
  })
}

// Format a time string to display format with Minsk timezone
export const formatTimeString = (dateString: string, format: Intl.DateTimeFormatOptions = {}): string => {
  const date = new Date(dateString)
  return date.toLocaleTimeString("en-US", {
    timeZone: "Europe/Minsk",
    ...format,
  })
}
