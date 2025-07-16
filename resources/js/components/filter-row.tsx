import { TextInput, Select, Group } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';

interface FilterRowProps {
  search: string;
  setSearch: (value: string) => void;
  status?: string;
  setStatus?: (value: string) => void;
  gender?: string;
  setGender?: (value: string) => void;
  bloodCenterId?: string;
  setBloodCenterId?: (value: string) => void;
  bloodGroup?: string;
  setBloodGroup?: (value:string)=> void;
  userId?: string;
  setUserId?: (value: string) => void;
  dateRange?: [Date | null, Date | null];
  setDateRange?: (range: [Date | null, Date | null]) => void;
  bloodCenters?: { value: string; label: string }[];
  bloodGroups?: { value: string; label: string }[];
  users?: { value: string; label: string }[];
}

export default function FilterRow({
  search,
  setSearch,
  gender,
  setGender,
  status,
  setStatus,
  bloodCenterId,
  setBloodCenterId,
  bloodGroup,
  setBloodGroup,
  userId,
  setUserId,
  dateRange,
  setDateRange,
  bloodCenters = [],
  users = [],
  bloodGroups = []
}: FilterRowProps) {
  return (
    <div className="flex flex-col gap-3 md:grid md:grid-cols-4 md:items-end">
      <TextInput
        label="Search"
        placeholder="Search user name or email"
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
      />

       {setGender && (
        <Select
          label="Gender"
          placeholder="Select Genders"
          data={[
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'other', label: 'Other' },
          ]}
          value={gender}
          onChange={(val) => setGender(val ?? '')}
          clearable
        />
      )}

      {setStatus && (
        <Select
          label="Status"
          placeholder="Select status"
          data={[
            { value: 'pending', label: 'Pending' },
            { value: 'accepted', label: 'Accepted' },
            { value: 'rejected', label: 'Rejected' },
          ]}
          value={status}
          onChange={(val) => setStatus(val ?? '')}
          clearable
        />
      )}

      {setBloodGroup && (
        <Select
          label="Blood Group"
          placeholder="Select Blood Group"
          data={bloodGroups}
          value={bloodGroup}
          onChange={(val) => setBloodGroup(val ?? '')}
          clearable
          searchable
        />
      )}

      {setBloodCenterId && (
        <Select
          label="Blood Center"
          placeholder="Select center"
          data={bloodCenters}
          value={bloodCenterId}
          onChange={(val) => setBloodCenterId(val ?? '')}
          clearable
          searchable
        />
      )}

      {setUserId && (
        <Select
          label="User"
          placeholder="Select user"
          data={users}
          value={userId}
          onChange={(val) => setUserId(val ?? '')}
          clearable
          searchable
        />
      )}

      {setDateRange && (
        <DatePickerInput
          type="range"
          label="Date Range"
          value={dateRange}
          clearable
        />
      )}
    </div>
  );
}
