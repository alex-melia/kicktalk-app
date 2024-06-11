export default function formatTimestamp(timestamp: string | null) {
  // Parse the timestamp into a Date object
  if (!timestamp) return null
  const date = new Date(timestamp)
  const now = new Date()

  // Calculate the difference in milliseconds
  const diffMs = now.getTime() - date.getTime()

  // Convert difference into minutes, hours, and days
  const diffMins = Math.floor(diffMs / 60000) // 60*1000
  const diffHours = Math.floor(diffMs / 3600000) // 60*60*1000

  // Format the timestamp based on the difference
  if (diffMins < 1) {
    return "Just now"
  } else if (diffMins < 60) {
    return `${diffMins}m`
  } else if (diffHours < 24) {
    return `${diffHours}h`
  } else {
    // Format the month and day
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ]
    const month = months[date.getMonth()]
    const day = date.getDate()
    return `${month} ${day}`
  }
}
