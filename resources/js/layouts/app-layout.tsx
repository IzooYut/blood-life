import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { usePage } from '@inertiajs/react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
    const { props: pageProps } = usePage();
    const flash = pageProps.flash as {
        success?: string;
        error?: string;
        warning?: string;
    };

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
        if (flash?.warning) toast(flash.warning, { icon: '⚠️' });
    }, [flash]);

    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            <Toaster
                position="top-center"
                toastOptions={{
                    className: 'text-sm',
                    duration: 4000,
                }}
            />
            {children}
        </AppLayoutTemplate>
    );
};
