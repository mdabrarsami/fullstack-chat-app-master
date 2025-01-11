export function formatMessageTime(date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function formatTimestamp(isoTimestamp, locale = "en-IN", timeZone = "UTC") {
  // Convert ISO timestamp to Date object
  const date = new Date(isoTimestamp);

  // Format options
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZone: timeZone,
    timeZoneName: "short",
  };

  // Return formatted date string
  return date.toLocaleString(locale, options);
}