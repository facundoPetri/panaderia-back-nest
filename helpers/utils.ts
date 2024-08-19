export function getDaysDifference(date1: Date, date2: Date): number {
  const oneDayInMilliseconds = 24 * 60 * 60 * 1000; // Milisegundos en un día
  const differenceInMilliseconds = Math.abs(date1.getTime() - date2.getTime());
  return Math.ceil(differenceInMilliseconds / oneDayInMilliseconds);
}
