import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';

type Props = {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
  tabIndex?: number;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  onGeneratePassword: () => void;
};

export default function PasswordGroup({
  id,
  label,
  value,
  onChange,
  error,
  placeholder,
  required,
  disabled,
  autoComplete = 'new-password',
  tabIndex,
  showPassword,
  setShowPassword,
  onGeneratePassword,
}: Props) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id} className="flex items-center justify-between">
        <button
          type="button"
          onClick={onGeneratePassword}
          className="text-sm text-blue-600 hover:underline"
        >
          Generate Password
        </button>
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="text-sm text-gray-600 hover:text-gray-800"
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </Label>
      <Input
        id={id}
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        tabIndex={tabIndex}
      />
      <InputError message={error} />
    </div>
  );
}
