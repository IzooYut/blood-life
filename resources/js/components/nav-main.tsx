// NavMain.tsx
import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import clsx from 'clsx';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();

    return (
        <SidebarGroup className="px-2 py-1">
            <SidebarMenu>
                {items.map((item) => {
                    const isActive = item.href === page.url;
                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                tooltip={{ children: item.title }}
                                className={clsx(
                                    'flex items-center gap-3 px-3 py-2 rounded-md transition-colors',
                                    isActive
                                        ? 'bg-[var(--accent)] text-white shadow'
                                        : 'hover:bg-[var(--accent)]/80 hover:text-white text-white/80'
                                )}
                            >
                                <Link href={item.href} prefetch className="flex items-center gap-3 w-full">
                                    {item.icon && <item.icon className="size-4" />}
                                    <span className="truncate text-sm font-medium">{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
