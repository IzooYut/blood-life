import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';

type Props = {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
  tabIndex?: number;
};

export default function InputGroup({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required,
  disabled,
  autoComplete,
  autoFocus,
  tabIndex,
}: Props) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        tabIndex={tabIndex}
      />
      <InputError message={error} />
    </div>
  );
}
