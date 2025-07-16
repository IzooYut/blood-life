import { useState } from 'react'
import dayjs from 'dayjs'

type DateRange = [Date | null, Date | null] | undefined

export function useDateRangeFilter(initial?: DateRange) {
  const [range, setRange] = useState<DateRange>(initial)

  const format = (date: Date | null | undefined) =>
    date ? dayjs(date).format('YYYY-MM-DD') : undefined

  const from_date = format(range?.[0])
  const to_date = format(range?.[1])

  return {
    range,
    setRange,
    from_date,
    to_date,
  }
}
