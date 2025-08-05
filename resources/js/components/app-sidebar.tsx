// AppSidebar.tsx
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { type NavItem } from '@/types';
import {
    LayoutGrid,
    Users,
    Hospital,
    CalendarHeart,
    Droplet,
    Database,
    UserSquare,
    GiftIcon,
    DropletsIcon,
    UserSquare2
} from 'lucide-react';
import AppLogo from './app-logo';
import { useRoleBasedNavigation, type UserType } from '@/hooks/useRoleBasedNavigation';
import { usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';

const mainNavItems: NavItem[] = [
    { title: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
    { title: 'Donors', href: '/donors', icon: Users },
    { title: 'Recipients', href: '/recipients', icon: UserSquare2},
    { title: 'Hospitals', href: '/hospitals', icon: Hospital },
    { title: 'Appointments', href: '/appointments', icon: CalendarHeart },
    { title: 'Blood Requests', href: '/blood-requests', icon: Droplet },
    { title: 'Donations', href: '/donations', icon: GiftIcon },
    { title: 'Blood Groups', href: '/blood-groups', icon: DropletsIcon },
    { title: 'Blood Centers', href: '/blood_centers', icon: Database },
    { title: 'System Users', href: '/system-users', icon: UserSquare },
];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;

    const { filteredNavItems } = useRoleBasedNavigation({
        userType: auth.user.user_type as UserType,
        allNavItems: mainNavItems
    });

    return (
        <Sidebar
            collapsible="icon"
            variant="inset"
            className="bg-[var(--sidebar)] text-white shadow-md"
        >
            <SidebarHeader className="px-0 py-0 border-b border-white/10">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="sm" asChild className="p-2">
                            <AppLogo />
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="flex-1 overflow-y-auto px-1 py-4">
                <NavMain items={filteredNavItems} />
            </SidebarContent>

            <SidebarFooter className="px-4 py-4 border-t border-white/10">
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}