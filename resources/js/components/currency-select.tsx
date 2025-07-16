import React from 'react';
import { usePage } from '@inertiajs/react';
import Select, { StylesConfig } from 'react-select';

interface Currency {
  code: string;
  name: string;
}

interface Option {
  label: string;
  value: string;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

const customStyles: StylesConfig<Option, false> = {
  control: (base, state) => ({
    ...base,
    backgroundColor: 'var(--input)',
    borderColor: state.isFocused ? 'var(--ring)' : 'var(--border)',
    color: 'var(--input-foreground)',
    borderRadius: '0.5rem',
    padding: '0.25rem 0.375rem',
    boxShadow: 'none',
    '&:hover': {
      borderColor: 'var(--ring)',
    },
  }),
  input: (base) => ({
    ...base,
    color: 'var(--input-foreground)',
  }),
  placeholder: (base) => ({
    ...base,
    color: 'var(--muted-foreground)',
  }),
  singleValue: (base) => ({
    ...base,
    color: 'var(--input-foreground)',
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: 'var(--popover)',
    color: 'var(--popover-foreground)',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    border: '1px solid var(--border)',
    marginTop: '0.25rem',
    zIndex: 10,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? 'var(--primary)'
      : state.isFocused
      ? 'var(--muted)'
      : 'transparent',
    color: state.isSelected
      ? 'var(--primary-foreground)'
      : 'var(--foreground)',
    padding: '0.5rem 0.75rem',
    cursor: 'pointer',
  }),
};

const CurrencySelect: React.FC<Props> = ({ value, onChange, label = '' }) => {
  const currencies = (usePage().props as any).currencies as Currency[];

  const options: Option[] = currencies.map((c) => ({
    label: `${c.name} (${c.code})`,
    value: c.code,
  }));

  const selectedOption = options.find((opt) => opt.value === value) || null;

  const handleChange = (option: Option | null) => {
    onChange(option?.value || '');
  };

  return (
    <div className="mb-4">
      {label && (
        <label className="block mb-1 text-sm font-medium text-foreground">
          {label} <span className="text-red-500">*</span>
        </label>
      )}
      <Select
        options={options}
        value={selectedOption}
        onChange={handleChange}
        placeholder="Select a currency..."
        isClearable
        isSearchable
        styles={customStyles}
        classNamePrefix="tw-currency-select"
      />
    </div>
  );
};

export default CurrencySelect;
