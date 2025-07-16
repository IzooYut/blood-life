import React from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import InputGroup from '@/components/input-group';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface PageProps {
  user: User;
}

export default function Edit({user}: PageProps) {
  

  const { data, setData, put, processing, errors } = useForm({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    put(`/system-users/${user.id}`);
  };

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'System Users',
      href: '/system-users',
    },
    {
      title: 'Edit',
      href: `/system-users/${user.id}/edit`,
    },
  ];

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

              <Button type="submit" className="mt-2 w-full" tabIndex={4} disabled={processing}>
                {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                Update
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
