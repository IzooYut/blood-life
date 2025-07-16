import { ReactNode } from 'react';
import { Link, usePage } from '@inertiajs/react';

interface Props {
  children: ReactNode;
}

export default function SidebarLayout({ children }: Props) {
  const { url } = usePage();

  const navItems = [
    { label: 'Dashboard', href: '/job-dashboard' },
    { label: 'Post Job', href: '/jobs-create' },
    { label: 'Job Listing', href: '/jobs-listing' },

    // { label: 'Job Bids', href: '/job-bids' },
    // { label: 'Subscription', href: '/subscription' },
    // { label: 'Payment History', href: '/payments' },
  ];

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-white border-r">
        <div className="p-6 font-bold text-lg">LOGO</div>
        <nav className="flex flex-col space-y-2 px-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`p-2 rounded-md text-sm hover:bg-gray-100 ${url.startsWith(item.href) ? 'bg-blue-700 text-white' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 bg-gray-50 p-6">
        {children}
      </main>
    </div>
  );
}