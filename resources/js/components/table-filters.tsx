// import { DatePickerInput } from '@mantine/dates'
import { TextInput, Select, Group } from '@mantine/core'
// import dayjs from 'dayjs'
// import DateRangeFilter from './date-range-filter'
// import { useState } from 'react'

interface Props {
  search: string
  setSearch: (val: string) => void
  status: string
  setStatus: (val: string) => void
  dateRange: [Date | null, Date | null]
  setDateRange: (range: [Date | null, Date | null]) => void
}

import { type DatesRangeValue } from '@mantine/dates'

// const [dateRange, setDateRange] = useState<DatesRangeValue>(null)



const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'dispatched', label: 'Dispatched' },
  { value: 'in_transit', label: 'In Transit' },
  { value: 'at_customs', label: 'At Customs' },
  { value: 'delivered', label: 'Delivered' },
]
export default function TableFilters({
  search,
  setSearch,
  status,
  setStatus,
  dateRange,
  setDateRange,
}: Props) {
  return (
    <Group gap="md" className="flex-wrap">
      <TextInput
        placeholder="Search tracking..."
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
      />
      <Select
        placeholder="Status"
        data={statusOptions}
        value={status}
        onChange={(val) => setStatus(val || '')}
        clearable
      />
    
    {/* <DateRangeFilter value={dateRange} onChange={setDateRange} /> */}
    </Group>
  )
}
