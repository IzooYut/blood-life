import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { UserInfo } from '@/components/user-info';
import { UserMenuContent } from '@/components/user-menu-content';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePage } from '@inertiajs/react';
import { ChevronsUpDown } from 'lucide-react';
import { type SharedData } from '@/types';

export function NavUser() {
  const { auth } = usePage<SharedData>().props;
  const { state } = useSidebar();
  const isMobile = useIsMobile();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 transition-colors bg-white/5 text-white hover:bg-[var(--accent)]/90"
            >
              <UserInfo user={auth.user} />
              <ChevronsUpDown className="ml-auto size-4 text-white/80" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-56 rounded-lg border border-zinc-100 bg-white shadow-lg"
            align="end"
            side={isMobile ? 'bottom' : state === 'collapsed' ? 'left' : 'bottom'}
          >
            <UserMenuContent user={auth.user} />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
