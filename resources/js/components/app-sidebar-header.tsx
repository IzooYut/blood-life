import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-200/80 bg-white/90 px-4 shadow-sm backdrop-blur-md">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Breadcrumbs breadcrumbs={breadcrumbs} />
      </div>

      {/* Optional Right-Side Button */}
      {/* <Link href="/donors/create" className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white hover:bg-[var(--primary)] text-sm font-medium shadow-sm transition">
        Register Donor
      </Link> */}
    </header>
  );
}
