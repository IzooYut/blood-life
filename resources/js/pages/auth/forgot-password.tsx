import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function ForgotPassword({ status }: { status?: string }) {
  const { data, setData, post, processing, errors } = useForm<{ email: string }>({
    email: '',
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('password.email'));
  };

  return (
    <AuthLayout
      title="Forgot your password?"
      description="We'll send you a secure link to reset it."
    >
      <Head title="Forgot password" />

      {status && (
        <div className="mb-4 text-center text-sm font-medium text-green-600">
          {status}
        </div>
      )}

      <form onSubmit={submit} className="space-y-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => setData('email', e.target.value)}
            placeholder="you@example.com"
            autoFocus
          />
          <InputError message={errors.email} />
        </div>

        <Button className="w-full" disabled={processing}>
          {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
          Send reset link
        </Button>

        <div className="text-sm text-center text-muted-foreground">
          Or return to <TextLink href={route('login')}>log in</TextLink>
        </div>
      </form>
    </AuthLayout>
  );
}
