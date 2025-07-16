import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function ConfirmPassword() {
  const { data, setData, post, processing, errors, reset } = useForm<{ password: string }>({
    password: '',
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('password.confirm'), {
      onFinish: () => reset('password'),
    });
  };

  return (
    <AuthLayout
      title="Confirm your password"
      description="This is a secure section. Please confirm your password to continue."
    >
      <Head title="Confirm password" />

      <form onSubmit={submit} className="space-y-6">
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            value={data.password}
            onChange={(e) => setData('password', e.target.value)}
            placeholder="••••••••"
            autoFocus
          />
          <InputError message={errors.password} />
        </div>

        <Button className="w-full" disabled={processing}>
          {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
          Confirm password
        </Button>
      </form>
    </AuthLayout>
  );
}
