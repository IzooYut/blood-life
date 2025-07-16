import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { toast } from 'react-hot-toast';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

import InputGroup from '@/components/input-group';
import PasswordGroup from '@/components/password-group';

type RegisterForm = {
  name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
};

export default function Create() {
  const { data, setData, post, processing, errors } = useForm<RegisterForm>({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post('/system-users');
  };

  const generateSecurePassword = (length = 12): string => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    return Array.from({ length }, () =>
      charset.charAt(Math.floor(Math.random() * charset.length))
    ).join('');
  };

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'System Users',
      href: '/system-users/create',
    },
  ];

  const handleGeneratePassword = () => {
    const newPassword = generateSecurePassword();
    setData('password', newPassword);
    setData('password_confirmation', newPassword);
    toast.success('A secure password has been auto-filled.');
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min px-4 py-4">
          <form className="flex flex-col gap-6" onSubmit={submit}>
            <div className="grid gap-6">
              <InputGroup
                id="name"
                label="Name"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                error={errors.name}
                required
                autoFocus
                tabIndex={1}
                autoComplete="name"
                disabled={processing}
                placeholder="Full name"
              />

              <InputGroup
                id="email"
                label="Email Address"
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                error={errors.email}
                required
                tabIndex={2}
                autoComplete="email"
                disabled={processing}
                placeholder="email@example.com"
              />

              <InputGroup
                id="phone"
                label="Phone"
                type="tel"
                value={data.phone}
                onChange={(e) => setData('phone', e.target.value)}
                error={errors.phone}
                required
                tabIndex={3}
                autoComplete="tel"
                disabled={processing}
                placeholder="0712345678"
              />

              <PasswordGroup
                id="password"
                label="Password"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                error={errors.password}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                onGeneratePassword={handleGeneratePassword}
                required
                tabIndex={4}
              />

              <InputGroup
                id="password_confirmation"
                label="Confirm Password"
                type="password"
                value={data.password_confirmation}
                onChange={(e) => setData('password_confirmation', e.target.value)}
                error={errors.password_confirmation}
                required
                tabIndex={5}
                autoComplete="new-password"
                disabled={processing}
                placeholder="Confirm password"
              />

              <Button type="submit" className="mt-2 w-full" tabIndex={6} disabled={processing}>
                {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                Create
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
