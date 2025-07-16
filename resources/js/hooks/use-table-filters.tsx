
import { router } from '@inertiajs/react'
import { useDebouncedValue } from '@mantine/hooks'
import { useEffect, useState } from 'react'

export interface TableFilters {
  search?: string
  status?: string
  from_date?: string
  to_date?: string
}
export function useTableFilters(initial: TableFilters, routeName: string) {
  const [search, setSearch] = useState(initial.search ?? '')
  const [status, setStatus] = useState(initial.status ?? '')
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    initial.from_date ? new Date(initial.from_date) : null,
    initial.to_date ? new Date(initial.to_date) : null,
  ])

  const [debouncedSearch] = useDebouncedValue(search, 300)

  const formatDate = (date?: Date | null) =>
    date ? date.toISOString().split('T')[0] : undefined

  const filters = {
    search: debouncedSearch || undefined,
    status: status || undefined,
    from_date: formatDate(dateRange[0]),
    to_date: formatDate(dateRange[1]),
  }

  useEffect(() => {
    router.get(route(routeName), filters, {
      preserveState: true,
      replace: true,
    })
  }, [debouncedSearch, status, dateRange])

  return {
    filters,
    search,
    status,
    dateRange,
    setSearch,
    setStatus,
    setDateRange,
  }
}
