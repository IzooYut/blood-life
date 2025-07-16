import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Droplet } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import BloodDonationLogo from '@/components/blood-donation-logo';

type LoginForm = {
  email: string;
  password: string;
  remember: boolean;
};

interface LoginProps {
  status?: string;
  canResetPassword: boolean;
}


export default function Login({ status, canResetPassword }: LoginProps) {
  const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
    email: '',
    password: '',
    remember: false,
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('login'), {
      onFinish: () => reset('password'),
    });
  };

  return (
    <>
      <Head title="Login" />

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#C62828] to-[#0B0146] px-4">
        <div className="w-full max-w-xl px-6 py-10 sm:px-12 bg-white rounded-2xl shadow-2xl border border-gray-200 animate-fade-in-down">
          {/* Logo Section */}
          <div className="flex justify-center mb-6">
              <BloodDonationLogo 
        size="xl" 
        className="transition-transform duration-300 hover:scale-105"
      />
          </div>

          <h2 className="text-xl font-semibold text-center text-[#0B0146] mb-1">
            Welcome back
          </h2>
          <p className="text-sm text-center text-gray-500 mb-6">
            Log in to manage donations, appointments, and more.
          </p>

          <form onSubmit={submit} className="flex flex-col gap-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  autoFocus
                  tabIndex={1}
                  autoComplete="email"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  placeholder="you@example.com"
                />
                <InputError message={errors.email} />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  {canResetPassword && (
                    <TextLink href={route('password.request')} className="ml-auto text-sm">
                      Forgot password?
                    </TextLink>
                  )}
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  tabIndex={2}
                  autoComplete="current-password"
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  placeholder="••••••••"
                />
                <InputError message={errors.password} />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  name="remember"
                  checked={data.remember}
                  onClick={() => setData('remember', !data.remember)}
                  tabIndex={3}
                />
                <Label htmlFor="remember" className="text-sm">Remember me</Label>
              </div>

              <Button
                type="submit"
                className="mt-2 w-full h-12 text-base font-semibold bg-[#C62828] hover:bg-[#B71C1C] text-white"
                tabIndex={4}
                disabled={processing}
              >
                {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                Log in
              </Button>
            </div>
          </form>

          {status && (
            <div className="mt-4 text-center text-sm font-medium text-green-600">{status}</div>
          )}
        </div>
      </div>
    </>
  );
}