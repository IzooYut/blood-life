import AppLogoIcon from '@/components/app-logo-icon';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
  name?: string;
  title?: string;
  description?: string;
}

export default function AuthSimpleLayout({
  children,
  title,
  description,
}: PropsWithChildren<AuthLayoutProps>) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[var(--background)] text-[var(--foreground)]">
      <div className="w-full max-w-md px-6 py-10 sm:px-10 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-2xl animate-fade-in-down">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Link href={route('home')} className="flex flex-col items-center gap-2 group">
            <AppLogoIcon className="size-16 transition-transform duration-300 group-hover:scale-105" />
            <span className="sr-only">{title}</span>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center space-y-1 mb-8">
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          {description && (
            <p className="text-muted-foreground text-sm">{description}</p>
          )}
        </div>

        {/* Form Content */}
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
}
