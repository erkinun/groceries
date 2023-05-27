export function printHumanReadableDate(date: Date) {
  return date.toLocaleDateString(); // TODO this makes us dependent on the locale of the user
}
