export default function formatFixture(timestamp: string) {
  const date = new Date(timestamp)

  const formatter = new Intl.DateTimeFormat("en-UK", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  })

  const formattedDate = formatter.format(date)

  return formattedDate
}
