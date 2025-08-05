import { useMemo } from 'react';
import { type NavItem } from '@/types';

export type UserType = 'donor' | 'admin' | 'hospital_staff' | 'center_staff';

const rolePermissions: Record<UserType, string[]> = {
    admin: [
        'Dashboard',
        'Donors',
        'Recipients',
        'Hospitals',
        'Appointments',
        'Blood Requests',
        'Donations',
        'Blood Groups',
        'Blood Centers',
        'System Users'
    ],
    hospital_staff: [
        'Dashboard',
        'Blood Requests', 
        'Recipients'      
    ],
    center_staff: [
        'Dashboard',
        'Donations',   
        'Appointments'
    ],
    donor: [
        'Dashboard'
    ]
};

interface UseRoleBasedNavigationProps {
    userType: UserType;
    allNavItems: NavItem[];
}

export function useRoleBasedNavigation({ 
    userType, 
    allNavItems 
}: UseRoleBasedNavigationProps) {
    const filteredNavItems = useMemo(() => {
        const allowedTitles = rolePermissions[userType] || [];
        
        return allNavItems.filter(item => 
            allowedTitles.includes(item.title)
        );
    }, [userType, allNavItems]);

    const canAccessRoute = (routeTitle: string): boolean => {
        const allowedTitles = rolePermissions[userType] || [];
        return allowedTitles.includes(routeTitle);
    };

    const canAccessPath = (path: string): boolean => {
       
        const pathToTitleMap: Record<string, string> = {
            '/dashboard': 'Dashboard',
            '/donors': 'Donors',
            '/recipients': 'Recipients',
            '/hospitals': 'Hospitals',
            '/appointments': 'Appointments',
            '/blood-requests': 'Blood Requests',
            '/donations': 'Donations',
            '/blood-groups': 'Blood Groups',
            '/blood_centers': 'Blood Centers',
            '/system-users': 'System Users'
        };

        const title = pathToTitleMap[path];
        return title ? canAccessRoute(title) : false;
    };

    return {
        filteredNavItems,
        canAccessRoute,
        canAccessPath,
        userType
    };
}