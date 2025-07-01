export function formatDate(isoString: string): string {
  const date = new Date(isoString);

  // Extract date components
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = String(date.getUTCFullYear()).slice(-2); // Get last two digits of the year

  // Extract time components
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');

  // Combine all components into the desired format
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}