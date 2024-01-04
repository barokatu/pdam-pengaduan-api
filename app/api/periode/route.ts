import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed

  const periodData = [];
  let year = 2010;
  let month = 1;

  while (year <= currentYear) {
    while (month <= 12) {
      periodData.push({
        value: `${new Date(year, month - 1).toLocaleString('default', { month: 'long' })} ${year}`,
        month: month.toString().padStart(2, '0'), // Pad with leading zero if needed
        year: year.toString(),
      });
      month++;
    }
    month = 1; // Reset for the next year
    year++;
  }

  return NextResponse.json({ data: periodData });
}