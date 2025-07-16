import { DatePickerInput } from '@mantine/dates';
import { useEffect, useState } from 'react';

interface DateRangeFilterProps {
  initialValue?: [string | null, string | null]; 
  onDateChange: (dates: { from_date: string | null; to_date: string | null }) => void;
}

export default function DateRangeFilter({ initialValue, onDateChange }: DateRangeFilterProps) {
  const [range, setRange] = useState<[string | null, string | null]>([null, null]);

  // Load initial value from backend
  

  // Propagate changes to parent
  useEffect(() => {
    onDateChange({ from_date: range[0], to_date: range[1] });
  }, [range]);

  return (
    <div className="relative">
      <DatePickerInput
        type="range"
        value={range}
        onChange={setRange}
        placeholder="Pick a start and end date"
        clearable
        allowSingleDateInRange
        className="w-full"
      />
    </div>
  );
}
